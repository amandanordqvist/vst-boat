import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { FileText, Download, Calendar, Shield, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  expires?: string;
  status: 'valid' | 'expiring' | 'expired';
  fileSize?: string;
  issuer?: string;
  documentNumber?: string;
  thumbnail?: string;
}

interface VesselDocumentsSectionProps {
  documents: Document[];
  onViewDocument: (id: string) => void;
  onDownloadDocument?: (id: string) => void;
  onCopyDocumentNumber?: (documentNumber: string) => void;
}

export default function VesselDocumentsSection({ 
  documents, 
  onViewDocument,
  onDownloadDocument,
  onCopyDocumentNumber
}: VesselDocumentsSectionProps) {
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  
  // Get status color based on document status
  const getStatusColor = (status: Document['status']) => {
    switch(status) {
      case 'valid':
        return Colors.status.success;
      case 'expiring':
        return Colors.status.warning;
      case 'expired':
        return Colors.status.error;
      default:
        return Colors.neutral[500];
    }
  };

  // Get status label based on document status
  const getStatusLabel = (status: Document['status']) => {
    switch(status) {
      case 'valid':
        return 'Valid';
      case 'expiring':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return '';
    }
  };
  
  // Toggle expanded state for a document
  const toggleExpand = (docId: string) => {
    setExpandedDocId(expandedDocId === docId ? null : docId);
  };
  
  // Format document type icon based on file type
  const getDocumentTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'pdf':
        return <FileText size={24} color={Colors.primary[600]} />;
      default:
        return <FileText size={24} color={Colors.primary[600]} />;
    }
  };
  
  // Handle copy document number
  const handleCopyDocNumber = (documentNumber: string) => {
    if (onCopyDocumentNumber) {
      onCopyDocumentNumber(documentNumber);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents</Text>
      
      {documents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No documents available</Text>
        </View>
      ) : (
        documents.map(doc => (
          <View key={doc.id} style={styles.documentCard}>
            <TouchableOpacity 
              style={styles.documentCardHeader}
              onPress={() => toggleExpand(doc.id)}
              activeOpacity={0.7}
            >
              <View style={styles.headerLeft}>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: getStatusColor(doc.status) }
                ]} />
                <View style={styles.docIconContainer}>
                  {getDocumentTypeIcon(doc.type)}
                </View>
                <View style={styles.documentBasicInfo}>
                  <Text style={styles.documentTitle}>{doc.title}</Text>
                  <Text style={styles.documentMeta}>
                    {doc.type} • {doc.fileSize} • {doc.expires ? `Expires: ${doc.expires}` : `Issued: ${doc.date}`}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                {expandedDocId === doc.id ? (
                  <ChevronUp size={20} color={Colors.neutral[600]} />
                ) : (
                  <ChevronDown size={20} color={Colors.neutral[600]} />
                )}
              </View>
            </TouchableOpacity>
            
            {expandedDocId === doc.id && (
              <View style={styles.expandedContent}>
                {doc.thumbnail && (
                  <View style={styles.thumbnailContainer}>
                    <Image 
                      source={{ uri: doc.thumbnail }} 
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  </View>
                )}
                
                <View style={styles.detailsContainer}>
                  {doc.documentNumber && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Document Number:</Text>
                      <View style={styles.docNumberContainer}>
                        <Text style={styles.detailValue}>{doc.documentNumber}</Text>
                        <TouchableOpacity 
                          style={styles.copyButton}
                          onPress={() => handleCopyDocNumber(doc.documentNumber || '')}
                        >
                          <Copy size={16} color={Colors.primary[600]} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  
                  {doc.issuer && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Issuing Authority:</Text>
                      <Text style={styles.detailValue}>{doc.issuer}</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Issue Date:</Text>
                    <Text style={styles.detailValue}>{doc.date}</Text>
                  </View>
                  
                  {doc.expires && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expiry Date:</Text>
                      <Text style={[
                        styles.detailValue,
                        doc.status === 'expired' && styles.expiredText,
                        doc.status === 'expiring' && styles.expiringText
                      ]}>{doc.expires}</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(doc.status) + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(doc.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(doc.status) }]}>
                        {getStatusLabel(doc.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={() => onViewDocument(doc.id)}
                  >
                    <ExternalLink size={16} color="#FFFFFF" />
                    <Text style={styles.viewButtonText}>View Document</Text>
                  </TouchableOpacity>
                  
                  {onDownloadDocument && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.downloadButton]}
                      onPress={() => onDownloadDocument(doc.id)}
                    >
                      <Download size={16} color={Colors.primary[600]} />
                      <Text style={styles.downloadButtonText}>Download</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  emptyContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
  },
  documentCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  documentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    marginLeft: 8,
  },
  statusIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  docIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentBasicInfo: {
    flex: 1,
  },
  documentTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  documentMeta: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[600],
  },
  expandedContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  thumbnailContainer: {
    width: '100%',
    height: 160,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.neutral[100],
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    width: 120,
  },
  detailValue: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[800],
    flex: 1,
  },
  expiredText: {
    color: Colors.status.error,
  },
  expiringText: {
    color: Colors.status.warning,
  },
  docNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  viewButton: {
    backgroundColor: Colors.primary[600],
  },
  viewButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 14,
    color: Colors.background,
    marginLeft: 8,
  },
  downloadButton: {
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  downloadButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginLeft: 8,
  },
});

// Enhanced sample document data with more fields
export const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Vessel Registration Certificate',
    type: 'PDF',
    date: 'Jan 30, 2023',
    expires: 'Jan 30, 2026',
    status: 'valid',
    fileSize: '2.4 MB',
    issuer: 'Maritime Authority',
    documentNumber: 'VST-2025-1234-REG',
    thumbnail: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400'
  },
  {
    id: '2',
    title: 'Insurance Policy',
    type: 'PDF',
    date: 'Mar 15, 2023',
    expires: 'Aug 15, 2023',
    status: 'expiring',
    fileSize: '3.8 MB',
    issuer: 'Marine Insurance Co.',
    documentNumber: 'MAR-98765-2025',
    thumbnail: 'https://images.unsplash.com/photo-1568745604624-f5f5b5d7ba8b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400'
  },
  {
    id: '3',
    title: 'Safety Inspection Certificate',
    type: 'PDF',
    date: 'Dec 10, 2022',
    expires: 'Dec 10, 2023',
    status: 'valid',
    fileSize: '1.2 MB',
    issuer: 'Maritime Safety Board',
    documentNumber: 'SAF-2022-7834',
    thumbnail: 'https://images.unsplash.com/photo-1547841243-eacb14453cd9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400'
  },
  {
    id: '4',
    title: 'Previous Service Record',
    type: 'PDF',
    date: 'May 5, 2023',
    status: 'valid',
    fileSize: '4.1 MB',
    issuer: 'Sunseeker Service Center',
    documentNumber: 'SVC-2023-459',
    thumbnail: 'https://images.unsplash.com/photo-1581094798497-60b13b2e79b3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400'
  }
]; 