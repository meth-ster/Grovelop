import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';
import { AlertService } from '../services/alertService';
import { api } from '../services/mockApi';
import { Document } from '../types';

type FormatOption = 'PDF' | 'Word' | 'Text' | 'HTML';
type BundleOption = 'resume_cover' | 'resume_only' | 'cover_only' | 'activity_portfolio' | 'complete_bundle';
type QualityOption = 'standard' | 'high' | 'print_ready';

interface ExportConfig {
  formats: FormatOption[];
  bundle: BundleOption;
  quality: QualityOption;
  activityProducts: string[];
}

const mockActivityProducts = [
  {
    id: '1',
    title: 'Systems Analysis for Customer Retention',
    pages: 6,
    selected: true,
  },
  {
    id: '2',
    title: 'Strategic Planning Workshop Portfolio',
    pages: 4,
    selected: false,
  },
  {
    id: '3',
    title: 'Leadership Communication Framework',
    pages: 3,
    selected: true,
  },
];

export default function ExportDistributionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jobTitle, company, documentData } = params;

  const [config, setConfig] = useState<ExportConfig>({
    formats: ['PDF'],
    bundle: 'resume_cover',
    quality: 'high',
    activityProducts: ['1', '3'],
  });

  const handleFormatToggle = (format: FormatOption) => {
    setConfig(prev => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter(f => f !== format)
        : [...prev.formats, format]
    }));
  };

  const handleBundleSelect = (bundle: BundleOption) => {
    setConfig(prev => ({ ...prev, bundle }));
  };

  const handleQualitySelect = (quality: QualityOption) => {
    setConfig(prev => ({ ...prev, quality }));
  };

  const handleActivityProductToggle = (productId: string) => {
    setConfig(prev => ({
      ...prev,
      activityProducts: prev.activityProducts.includes(productId)
        ? prev.activityProducts.filter(id => id !== productId)
        : [...prev.activityProducts, productId]
    }));
  };

  const handleDownload = async () => {
    try {
      // Get the selected bundle configuration
      const bundleInfo = getBundleInfo(config.bundle);
      const formatInfo = config.formats.join(', ');
      const qualityInfo = getQualityInfo(config.quality);
      
      // Show loading state
      AlertService.info('Generating and saving documents...');
      
      // Generate documents based on bundle selection
      const documents = await generateDocuments(config.bundle, config.formats, config.quality);
      
      if (documents.length === 0) {
        AlertService.error('No documents available to save. Please check your document content.');
        return;
      }
      
      // Save documents to storage
      for (const doc of documents) {
        await api.createDocument(doc);
      }
      
      // Generate and download actual files
      const downloadedFiles = await generateAndDownloadFiles(documents, config.formats, config.quality);
      
      AlertService.success(`Successfully saved ${documents.length} document(s) and downloaded ${downloadedFiles.length} file(s)!`);
      
      // Navigate to jobs screen after a short delay
      // setTimeout(() => {
      //   router.push('/(tabs)/jobs');
      // }, 1500);
    } catch (error) {
      console.error('Error downloading documents:', error);
      AlertService.error('Failed to save documents. Please try again.');
    }
  };

  const handleEmailToSelf = async () => {
    try {
      const bundleInfo = getBundleInfo(config.bundle);
      const formatInfo = config.formats.join(', ');
      const qualityInfo = getQualityInfo(config.quality);
      
      // Show loading state
      AlertService.info('Generating documents for email...');
      
      // Generate documents based on bundle selection
      const documents = await generateDocuments(config.bundle, config.formats, config.quality);
      
      if (documents.length === 0) {
        AlertService.error('No documents available to email. Please check your document content.');
        return;
      }
      
      // Generate files for emailing in the selected formats
      const emailFiles = await generateFilesForEmail(documents, config.formats, config.quality);
      
      if (emailFiles.length === 0) {
        AlertService.error('No files were generated for email. Please try again.');
        return;
      }
      
      // Show options for emailing
      Alert.alert(
        'Email Documents',
        `Generated ${emailFiles.length} file(s) in ${config.formats.join(', ')} format(s). How would you like to proceed?`,
        [
          {
            text: 'Share Files',
            onPress: () => shareFilesForEmail(emailFiles),
          },
          {
            text: 'Open Email Client',
            onPress: () => openEmailClientWithInstructions(emailFiles, bundleInfo, formatInfo, qualityInfo),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error opening email client:', error);
      Alert.alert(
        'Error',
        'Failed to open email client. Please try again or use the download option.',
        [{ text: 'OK' }]
      );
    }
  };

  const getBundleInfo = (bundle: BundleOption): string => {
    switch (bundle) {
      case 'complete_bundle':
        return 'Complete Application Bundle (Resume + Cover Letter + Portfolio Item)';
      case 'resume_cover':
        return 'Resume + Cover Letter';
      case 'resume_only':
        return 'Resume Only';
      case 'cover_only':
        return 'Cover Letter Only';
      default:
        return 'Selected Documents';
    }
  };

  const getQualityInfo = (quality: QualityOption): string => {
    switch (quality) {
      case 'standard':
        return 'Standard Quality';
      case 'high':
        return 'High Quality';
      case 'print_ready':
        return 'Print Ready';
      default:
        return 'High Quality';
    }
  };

  const generateDocuments = async (bundle: BundleOption, formats: FormatOption[], quality: QualityOption): Promise<Omit<Document, 'id' | 'createdAt' | 'updatedAt'>[]> => {
    const documents: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>[] = [];
    const timestamp = new Date().toISOString();
    
    // Get the primary format (first selected format)
    const primaryFormat = formats[0]?.toLowerCase() as 'pdf' | 'docx' | 'txt';
    
    // Parse document data from the previous screen
    let sourceDocuments: any[] = [];
    try {
      if (documentData) {
        sourceDocuments = JSON.parse(documentData as string);
        console.log('Parsed source documents:', sourceDocuments);
      } else {
        console.log('No document data provided');
      }
    } catch (error) {
      console.error('Error parsing document data:', error);
    }
    
    // Get document content from the source documents
    const resumeDoc = sourceDocuments.find(doc => doc.type === 'resume');
    const coverLetterDoc = sourceDocuments.find(doc => doc.type === 'cover_letter');
    
    const resumeContent = resumeDoc?.content || 'Resume content not available';
    const coverLetterContent = coverLetterDoc?.content || 'Cover letter content not available';
    
    console.log('Resume doc found:', !!resumeDoc, 'Content length:', resumeContent.length);
    console.log('Cover letter doc found:', !!coverLetterDoc, 'Content length:', coverLetterContent.length);

    // Generate documents based on bundle selection
    switch (bundle) {
      case 'resume_only':
        if (resumeContent && resumeContent !== 'Resume content not available') {
          documents.push({
            title: `Resume - ${jobTitle || 'Application'}${company ? ` at ${company}` : ''}`,
            type: 'resume',
            content: resumeContent,
            format: primaryFormat,
            targetJob: jobTitle as string,
            versions: [{
              id: '1',
              version: 1,
              content: resumeContent,
              changes: 'Initial version generated',
              createdAt: timestamp,
            }],
          });
        }
        break;
        
      case 'cover_only':
        if (coverLetterContent && coverLetterContent !== 'Cover letter content not available') {
          documents.push({
            title: `Cover Letter - ${jobTitle || 'Application'}${company ? ` at ${company}` : ''}`,
            type: 'cover_letter',
            content: coverLetterContent,
            format: primaryFormat,
            targetJob: jobTitle as string,
            versions: [{
              id: '1',
              version: 1,
              content: coverLetterContent,
              changes: 'Initial version generated',
              createdAt: timestamp,
            }],
          });
        }
        break;
        
      case 'resume_cover':
        if (resumeContent && resumeContent !== 'Resume content not available') {
          documents.push({
            title: `Resume - ${jobTitle || 'Application'}${company ? ` at ${company}` : ''}`,
            type: 'resume',
            content: resumeContent,
            format: primaryFormat,
            targetJob: jobTitle as string,
            versions: [{
              id: '1',
              version: 1,
              content: resumeContent,
              changes: 'Initial version generated',
              createdAt: timestamp,
            }],
          });
        }
        if (coverLetterContent && coverLetterContent !== 'Cover letter content not available') {
          documents.push({
            title: `Cover Letter - ${jobTitle || 'Application'}${company ? ` at ${company}` : ''}`,
            type: 'cover_letter',
            content: coverLetterContent,
            format: primaryFormat,
            targetJob: jobTitle as string,
            versions: [{
              id: '1',
              version: 1,
              content: coverLetterContent,
              changes: 'Initial version generated',
              createdAt: timestamp,
            }],
          });
        }
        break;
        
      case 'complete_bundle':
        if (resumeContent && resumeContent !== 'Resume content not available') {
          documents.push({
            title: `Resume - ${jobTitle || 'Application'}${company ? ` at ${company}` : ''}`,
            type: 'resume',
            content: resumeContent,
            format: primaryFormat,
            targetJob: jobTitle as string,
            versions: [{
              id: '1',
              version: 1,
              content: resumeContent,
              changes: 'Initial version generated',
              createdAt: timestamp,
            }],
          });
        }
        if (coverLetterContent && coverLetterContent !== 'Cover letter content not available') {
          documents.push({
            title: `Cover Letter - ${jobTitle || 'Application'}${company ? ` at ${company}` : ''}`,
            type: 'cover_letter',
            content: coverLetterContent,
            format: primaryFormat,
            targetJob: jobTitle as string,
            versions: [{
              id: '1',
              version: 1,
              content: coverLetterContent,
              changes: 'Initial version generated',
              createdAt: timestamp,
            }],
          });
        }
        documents.push({
          title: `Portfolio - ${jobTitle || 'Application'}${company ? ` at ${company}` : ''}`,
          type: 'portfolio',
          content: 'Portfolio content would be generated here based on user activities and achievements.',
          format: primaryFormat,
          targetJob: jobTitle as string,
          versions: [{
            id: '1',
            version: 1,
            content: 'Portfolio content would be generated here based on user activities and achievements.',
            changes: 'Initial version generated',
            createdAt: timestamp,
          }],
        });
        break;
    }
    
    return documents;
  };

  const generateAndDownloadFiles = async (documents: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>[], formats: FormatOption[], quality: QualityOption): Promise<string[]> => {
    const downloadedFiles: string[] = [];
    
    for (const document of documents) {
      for (const format of formats) {
        try {
          const fileName = generateFileName(document.title, format, quality);
          const filePath = await generateFile(document, format, quality, fileName);
          
          if (filePath) {
            // Share/download the file
            await shareFile(filePath, fileName);
            downloadedFiles.push(fileName);
          }
        } catch (error) {
          console.error(`Error generating ${format} file for ${document.title}:`, error);
        }
      }
    }
    
    return downloadedFiles;
  };

  const generateFilesForEmail = async (documents: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>[], formats: FormatOption[], quality: QualityOption): Promise<{fileName: string, filePath: string}[]> => {
    const emailFiles: {fileName: string, filePath: string}[] = [];
    
    for (const document of documents) {
      for (const format of formats) {
        try {
          const fileName = generateFileName(document.title, format, quality);
          const filePath = await generateFile(document, format, quality, fileName);
          
          if (filePath) {
            emailFiles.push({ fileName, filePath });
          }
        } catch (error) {
          console.error(`Error generating ${format} file for ${document.title}:`, error);
        }
      }
    }
    
    return emailFiles;
  };

  const generateFileName = (title: string, format: FormatOption, quality: QualityOption): string => {
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    const qualitySuffix = quality === 'print_ready' ? '_print' : quality === 'high' ? '_high' : '';
    
    return `${sanitizedTitle}_${timestamp}${qualitySuffix}.${format.toLowerCase()}`;
  };

  const generateFile = async (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, format: FormatOption, quality: QualityOption, fileName: string): Promise<string | null> => {
    try {
      // Get document directory with fallback
      let documentsDir: string;
      try {
        // Try new API first
        documentsDir = Paths.document.uri;
        console.log('Using new API, document directory:', documentsDir);
      } catch (error) {
        // Fallback to legacy API
        documentsDir = (FileSystem as any).documentDirectory || '';
        console.log('Using legacy API, document directory:', documentsDir);
      }
      
      if (!documentsDir) {
        throw new Error('Document directory not available');
      }
      
      const downloadsDir = documentsDir + 'Downloads/';
      
      // Ensure the Downloads directory exists
      const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
      }

      const filePath = downloadsDir + fileName;

      switch (format) {
        case 'PDF':
          return await generatePDF(document, filePath, quality);
        case 'HTML':
          return await generateHTML(document, filePath, quality);
        case 'Text':
          return await generateText(document, filePath, quality);
        case 'Word':
          // For Word format, we'll generate HTML that can be opened in Word
          return await generateWordCompatible(document, filePath, quality);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Error generating file:', error);
      return null;
    }
  };

  const generatePDF = async (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, filePath: string, quality: QualityOption): Promise<string | null> => {
    try {
      const htmlContent = generateHTMLContent(document, quality);
      
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // The generated PDF is already saved, just return its URI
      return uri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const generateHTML = async (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, filePath: string, quality: QualityOption): Promise<string | null> => {
    try {
      const htmlContent = generateHTMLContent(document, quality);
      await FileSystem.writeAsStringAsync(filePath, htmlContent);
      return filePath;
    } catch (error) {
      console.error('Error generating HTML:', error);
      return null;
    }
  };

  const generateText = async (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, filePath: string, quality: QualityOption): Promise<string | null> => {
    try {
      // Clean up the text content for plain text format
      const textContent = document.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags if any
        .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
        .trim();
      
      await FileSystem.writeAsStringAsync(filePath, textContent);
      return filePath;
    } catch (error) {
      console.error('Error generating text file:', error);
      return null;
    }
  };

  const generateWordCompatible = async (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, filePath: string, quality: QualityOption): Promise<string | null> => {
    try {
      // Generate HTML that's compatible with Word
      const htmlContent = generateWordCompatibleHTML(document, quality);
      const wordFilePath = filePath.replace('.word', '.html');
      await FileSystem.writeAsStringAsync(wordFilePath, htmlContent);
      return wordFilePath;
    } catch (error) {
      console.error('Error generating Word-compatible file:', error);
      return null;
    }
  };

  const generateHTMLContent = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, quality: QualityOption): string => {
    const fontSize = quality === 'print_ready' ? '12px' : quality === 'high' ? '11px' : '10px';
    const lineHeight = quality === 'print_ready' ? '1.6' : '1.4';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${document.title}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            font-size: ${fontSize};
            line-height: ${lineHeight};
            margin: 1in;
            color: #000;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 2em;
            border-bottom: 2px solid #000;
            padding-bottom: 1em;
          }
          .content {
            white-space: pre-line;
            text-align: left;
          }
          .footer {
            margin-top: 2em;
            text-align: center;
            font-size: 0.9em;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${document.title}</h1>
          <p>Generated by Grovelop - ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="content">${document.content}</div>
        <div class="footer">
          <p>This document was generated by Grovelop to help you realize your professional potential.</p>
        </div>
      </body>
      </html>
    `;
  };

  const generateWordCompatibleHTML = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, quality: QualityOption): string => {
    return `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <title>${document.title}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 1in;
          }
          .content {
            white-space: pre-line;
          }
        </style>
      </head>
      <body>
        <h1>${document.title}</h1>
        <div class="content">${document.content}</div>
      </body>
      </html>
    `;
  };

  const shareFile = async (filePath: string, fileName: string): Promise<void> => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: getMimeType(fileName),
          dialogTitle: `Download ${fileName}`,
        });
      } else {
        // Fallback for platforms that don't support sharing
        Alert.alert(
          'File Generated',
          `File ${fileName} has been saved to your device.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  };

  const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'html':
        return 'text/html';
      case 'txt':
        return 'text/plain';
      case 'doc':
      case 'docx':
        return 'application/msword';
      default:
        return 'application/octet-stream';
    }
  };

  const shareFilesForEmail = async (emailFiles: {fileName: string, filePath: string}[]): Promise<void> => {
    try {
      // Share the first file (most email clients can handle multiple files from the same share)
      const firstFile = emailFiles[0];
      if (firstFile) {
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(firstFile.filePath, {
            mimeType: getMimeType(firstFile.fileName),
            dialogTitle: `Share ${emailFiles.length} document(s) via email`,
            UTI: 'public.item', // Universal type identifier for sharing
          });
          AlertService.success(`Sharing ${emailFiles.length} file(s) for email...`);
        } else {
          Alert.alert(
            'Sharing Not Available',
            'File sharing is not available on this device. Please use the download option instead.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error sharing files for email:', error);
      AlertService.error('Failed to share files. Please try the download option instead.');
    }
  };

  const openEmailClientWithInstructions = async (
    emailFiles: {fileName: string, filePath: string}[], 
    bundleInfo: string, 
    formatInfo: string, 
    qualityInfo: string
  ): Promise<void> => {
    try {
      const subject = `Grovelop Application Documents${jobTitle ? ` - ${jobTitle}` : ''}${company ? ` at ${company}` : ''}`;
      const body = `Hello,

Please find your job application documents:

Bundle: ${bundleInfo}
Format: ${formatInfo}
Quality: ${qualityInfo}

Documents generated:
${emailFiles.map(file => `• ${file.fileName}`).join('\n')}

IMPORTANT: The files have been saved to your device. Please attach them to this email:
${emailFiles.map(file => `• ${file.fileName}`).join('\n')}

These documents were generated by Grovelop to help you realize your professional potential.

Best regards,
The Grovelop Team`;

      // Encode URI components
      const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Check if the device can open the email URL
      const canOpen = await Linking.canOpenURL(emailUrl);
      
      if (canOpen) {
        await Linking.openURL(emailUrl);
        AlertService.success(`Opening email client. Please attach the ${emailFiles.length} generated file(s) to your email.`);
      } else {
        Alert.alert(
          'Email Not Available',
          'Unable to open email client. Please check your email app settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening email client:', error);
      Alert.alert(
        'Error',
        'Failed to open email client. Please try again or use the download option.',
        [{ text: 'OK' }]
      );
    }
  };

  // const simulateDownload = (bundleInfo: string, formatInfo: string, qualityInfo: string) => {
  //   console.log(`Downloading: ${bundleInfo} in ${formatInfo} format (${qualityInfo})`);
  //   // Simulate download completion
  //   setTimeout(() => {
  //     console.log('Download completed successfully');
  //     AlertService.success('Download completed successfully');
  //     // router.push('/apply-mailbox');
  //   }, 1000);
  // };

  const simulateEmailSend = (bundleInfo: string, formatInfo: string) => {
    console.log(`Emailing: ${bundleInfo} in ${formatInfo} format`);
    // Simulate email sending
    setTimeout(() => {
      console.log('Email sent successfully');
      AlertService.success('Email sent successfully');
      router.push('/apply-mailbox');
    }, 1000);
  };

  const renderOption = (
    label: string,
    options: { value: any; label: string; description?: string }[],
    currentValue: any,
    onSelect: (value: any) => void,
    multiSelect = false
  ) => (
    <View style={styles.optionGroup}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionButtons}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              multiSelect 
                ? (currentValue as any[]).includes(option.value) && styles.selectedOption
                : currentValue === option.value && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.optionText,
              multiSelect 
                ? (currentValue as any[]).includes(option.value) && styles.selectedOptionText
                : currentValue === option.value && styles.selectedOptionText,
            ]}>
              {option.label}
            </Text>
            {option.description && (
              <Text style={styles.optionDescription}>{option.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Context */}
        <View style={styles.jobContext}>
          <Text style={styles.contextTitle}>Download Your Documents</Text>
        </View>


        {/* Format Options */}
        {renderOption(
          'Format Options:',
          [
            { value: 'PDF', label: 'PDF (Recommended for applications)', description: 'Best for job applications' },
            { value: 'Word', label: 'Word Document (.docx)', description: 'Editable format' },
            { value: 'Text', label: 'Plain Text (.txt)', description: 'Simple text format' },
            { value: 'HTML', label: 'HTML Web Format', description: 'Web-friendly format' },
          ],
          config.formats,
          handleFormatToggle,
          true
        )}

        {/* Bundle Options */}
        {renderOption(
          'Bundle Options:',
          [
            { value: 'complete_bundle', label: 'Complete Application Bundle (Resume + Cover Letter + Portfolio Item)', description: 'Everything included' },
            { value: 'resume_cover', label: 'Resume + Cover Letter', description: 'Complete application package' },
            { value: 'resume_only', label: 'Resume Only', description: 'Just the resume' },
            { value: 'cover_only', label: 'Cover Letter Only', description: 'Just the cover letter' },
          ],
          config.bundle,
          handleBundleSelect
        )}


        {/* Quality Settings */}
        {renderOption(
          'Quality Settings:',
          [
            { value: 'standard', label: 'Standard (Smaller file size)', description: 'Good for email attachments' },
            { value: 'high', label: 'High Quality (Recommended)', description: 'Best balance of quality and size' },
            { value: 'print_ready', label: 'Print Ready (Highest quality)', description: 'For printing and presentations' },
          ],
          config.quality,
          handleQualitySelect
        )}

        {/* Export Summary */}
        <View style={styles.exportSummary}>
          <Text style={styles.summaryTitle}>Export Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bundle:</Text>
              <Text style={styles.summaryValue}>{getBundleInfo(config.bundle)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Format:</Text>
              <Text style={styles.summaryValue}>{config.formats.join(', ')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quality:</Text>
              <Text style={styles.summaryValue}>{getQualityInfo(config.quality)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleDownload}>
            <Ionicons name="download" size={20} color={Colors.text.primary} />
            <Text style={styles.primaryButtonText}>Download and Save</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleEmailToSelf}>
            <Ionicons name="mail" size={20} color={Colors.primary.navyBlue} />
            <Text style={styles.secondaryButtonText}>Email documents to Myself</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  scrollContent: {
    paddingBottom: Layout.spacing['2xl'],
  },
  jobContext: {
    backgroundColor: Colors.primary.navyBlue,
    padding: Layout.spacing.lg,
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.xl,
  },
  contextTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Layout.spacing.xs,
  },
  skipSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  skipButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  optionGroup: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  optionLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  optionButtons: {
    gap: Layout.spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: Colors.primary.goldenYellow,
    borderColor: Colors.primary.navyBlue,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  selectedOptionText: {
    fontWeight: Typography.fontWeight.bold,
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  activityProductsList: {
    gap: Layout.spacing.sm,
  },
  activityProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedActivityProduct: {
    borderColor: Colors.primary.goldenYellow,
    backgroundColor: Colors.background.tertiary,
  },
  activityProductContent: {
    flex: 1,
  },
  activityProductTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  activityProductPages: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  actionButtons: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    gap: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.navyBlue,
  },
  exportSummary: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary.goldenYellow,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  summaryContent: {
    gap: Layout.spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 2,
    textAlign: 'right',
  },
});
