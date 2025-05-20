import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { IconConfig } from '@/constants/IconConfig';
import { ChevronRight, FileText, FileType, Image as ImageIcon, FileSpreadsheet, File } from 'lucide-react-native';

type DocumentType = 'pdf' | 'image' | 'doc' | 'spreadsheet' | 'file';

interface DocumentCardProps {
  id: string;
  title: string;
  documentType: DocumentType;
  dateAdded: string;
  size: string;
  onView: () => void;
  category?: string;
}

export default function DocumentCard({
  title,
  documentType,
  dateAdded,
  size,
  category,
  onView
}: DocumentCardProps) {
  
  const getDocumentIcon = (type: DocumentType) => {
    switch(type) {
      case 'pdf': 
        return <FileType size={IconConfig.size.medium} color={Colors.status.error} />;
      case 'image': 
        return <ImageIcon size={IconConfig.size.medium} color={Colors.status.info} />;
      case 'doc': 
        return <FileText size={IconConfig.size.medium} color={Colors.primary[600]} />;
      case 'spreadsheet': 
        return <FileSpreadsheet size={IconConfig.size.medium} color={Colors.status.success} />;
      default: 
        return <File size={IconConfig.size.medium} color={Colors.neutral[600]} />;
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onView}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getDocumentIcon(documentType)}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {dateAdded} • {size}
          {category && ` • ${category}`}
        </Text>
      </View>
      
      <ChevronRight size={IconConfig.size.small} color={Colors.neutral[400]} />
    </TouchableOpacity>
  );
}

export function DocumentCardList({ documents, title }: {
  documents: DocumentCardProps[];
  title?: string;
}) {
  if (!documents || documents.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.listContainer}>
      {title && <Text style={styles.listTitle}>{title}</Text>}
      
      <View style={styles.documentsList}>
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            {...doc}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  meta: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  listContainer: {
    marginBottom: 24,
  },
  listTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary[700],
    marginBottom: 16,
    marginHorizontal: 4,
  },
  documentsList: {
    
  }
}); 