import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert,
  Image,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface CrewMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'captain' | 'first_mate' | 'crew' | 'guest';
  avatar?: string;
  certifications: string[];
  joinDate: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'pending';
  permissions: {
    canEditSettings: boolean;
    canManageTrips: boolean;
    canViewReports: boolean;
    canManageCrew: boolean;
  };
}

interface CrewManagementProps {
  vesselName?: string;
  onCrewUpdated?: (crew: CrewMember[]) => void;
  onBack?: () => void;
}

export const CrewManagement: React.FC<CrewManagementProps> = ({
  vesselName = "M/Y Seahawk",
  onCrewUpdated,
  onBack
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock crew data
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([
    {
      id: '1',
      name: 'John Anderson',
      email: 'john@example.com',
      phone: '+46 70 123 4567',
      role: 'owner',
      avatar: 'https://i.pravatar.cc/150?img=3',
      certifications: ['Yacht Master', 'RYA Coastal Skipper'],
      joinDate: new Date('2023-01-15'),
      lastActive: new Date(),
      status: 'active',
      permissions: {
        canEditSettings: true,
        canManageTrips: true,
        canViewReports: true,
        canManageCrew: true
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+46 70 987 6543',
      role: 'captain',
      avatar: 'https://i.pravatar.cc/150?img=5',
      certifications: ['Commercial Skipper', 'First Aid'],
      joinDate: new Date('2023-03-20'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
      permissions: {
        canEditSettings: false,
        canManageTrips: true,
        canViewReports: true,
        canManageCrew: false
      }
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '+46 70 456 7890',
      role: 'first_mate',
      avatar: 'https://i.pravatar.cc/150?img=7',
      certifications: ['Powerboat Level 2'],
      joinDate: new Date('2023-06-10'),
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'active',
      permissions: {
        canEditSettings: false,
        canManageTrips: false,
        canViewReports: true,
        canManageCrew: false
      }
    }
  ]);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'crew' as CrewMember['role']
  });

  const roleConfig = {
    owner: { label: 'Owner', color: '#8B5CF6', icon: 'crown' },
    captain: { label: 'Captain', color: '#3B82F6', icon: 'boat' },
    first_mate: { label: 'First Mate', color: '#10B981', icon: 'compass' },
    crew: { label: 'Crew', color: '#F59E0B', icon: 'people' },
    guest: { label: 'Guest', color: '#6B7280', icon: 'person-add' }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.status.success;
      case 'inactive': return Colors.neutral[400];
      case 'pending': return Colors.status.warning;
      default: return Colors.neutral[400];
    }
  };

  const formatLastActive = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'Active now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const member: CrewMember = {
      id: Date.now().toString(),
      ...newMember,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 20)}`,
      certifications: [],
      joinDate: new Date(),
      lastActive: new Date(),
      status: 'pending',
      permissions: {
        canEditSettings: false,
        canManageTrips: newMember.role === 'captain',
        canViewReports: true,
        canManageCrew: false
      }
    };

    setCrewMembers([...crewMembers, member]);
    setNewMember({ name: '', email: '', phone: '', role: 'crew' });
    setShowAddModal(false);
    
    Alert.alert('Success', `Invitation sent to ${member.name}`);
  };

  const handleRoleChange = (memberId: string, newRole: CrewMember['role']) => {
    setCrewMembers(crewMembers.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            role: newRole,
            permissions: {
              ...member.permissions,
              canManageTrips: newRole === 'captain' || newRole === 'owner',
              canEditSettings: newRole === 'owner',
              canManageCrew: newRole === 'owner'
            }
          }
        : member
    ));
    setShowRoleModal(false);
    setSelectedMember(null);
  };

  const filteredCrew = crewMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary[600], Colors.primary[700]]}
        style={styles.header}
      >
        {onBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Crew Management</Text>
          <Text style={styles.headerSubtitle}>{vesselName}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.neutral[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crew members..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.neutral[500]}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{crewMembers.length}</Text>
            <Text style={styles.statLabel}>Total Crew</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {crewMembers.filter(m => m.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {crewMembers.filter(m => m.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Crew List */}
        <View style={styles.crewSection}>
          <Text style={styles.sectionTitle}>Crew Members</Text>
          
          {filteredCrew.map(member => (
            <TouchableOpacity 
              key={member.id} 
              style={styles.crewCard}
              onPress={() => {
                setSelectedMember(member);
                setShowRoleModal(true);
              }}
            >
              <View style={styles.crewInfo}>
                <View style={styles.avatarContainer}>
                  {member.avatar ? (
                    <Image source={{ uri: member.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: roleConfig[member.role].color }]}>
                      <Text style={styles.avatarText}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]} />
                </View>

                <View style={styles.memberDetails}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: roleConfig[member.role].color }]}>
                      <Ionicons 
                        name={roleConfig[member.role].icon as any} 
                        size={12} 
                        color="#fff" 
                      />
                      <Text style={styles.roleText}>{roleConfig[member.role].label}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.memberEmail}>{member.email}</Text>
                  <Text style={styles.memberPhone}>{member.phone}</Text>
                  
                  <View style={styles.memberMeta}>
                    <Text style={styles.lastActive}>
                      {formatLastActive(member.lastActive)}
                    </Text>
                    <Text style={styles.joinDate}>
                      Joined {member.joinDate.toLocaleDateString()}
                    </Text>
                  </View>

                  {member.certifications.length > 0 && (
                    <View style={styles.certifications}>
                      {member.certifications.slice(0, 2).map((cert, index) => (
                        <View key={index} style={styles.certBadge}>
                          <Text style={styles.certText}>{cert}</Text>
                        </View>
                      ))}
                      {member.certifications.length > 2 && (
                        <Text style={styles.moreCerts}>
                          +{member.certifications.length - 2} more
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color={Colors.neutral[400]} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Member Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Crew Member</Text>
            <TouchableOpacity onPress={handleAddMember}>
              <Text style={styles.saveButton}>Send Invite</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={newMember.name}
                onChangeText={(text) => setNewMember({...newMember, name: text})}
                placeholder="Enter full name"
                placeholderTextColor={Colors.neutral[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={newMember.email}
                onChangeText={(text) => setNewMember({...newMember, email: text})}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.neutral[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={newMember.phone}
                onChangeText={(text) => setNewMember({...newMember, phone: text})}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                placeholderTextColor={Colors.neutral[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleSelector}>
                {Object.entries(roleConfig).map(([key, config]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.roleOption,
                      newMember.role === key && styles.roleOptionSelected
                    ]}
                    onPress={() => setNewMember({...newMember, role: key as CrewMember['role']})}
                  >
                    <Ionicons 
                      name={config.icon as any} 
                      size={20} 
                      color={newMember.role === key ? '#fff' : config.color} 
                    />
                    <Text style={[
                      styles.roleOptionText,
                      newMember.role === key && styles.roleOptionTextSelected
                    ]}>
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.permissionsInfo}>
              <Text style={styles.permissionsTitle}>Role Permissions</Text>
              <Text style={styles.permissionsText}>
                {newMember.role === 'owner' && 'Full access to all features and settings'}
                {newMember.role === 'captain' && 'Can manage trips, view reports, and access navigation'}
                {newMember.role === 'first_mate' && 'Can view reports and assist with trips'}
                {newMember.role === 'crew' && 'Can view basic information and complete checklists'}
                {newMember.role === 'guest' && 'Limited read-only access'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Role Change Modal */}
      <Modal visible={showRoleModal} transparent animationType="fade">
        <View style={styles.roleModalOverlay}>
          <View style={styles.roleModalContent}>
            {selectedMember && (
              <>
                <View style={styles.roleModalHeader}>
                  <Text style={styles.roleModalTitle}>Change Role</Text>
                  <Text style={styles.roleModalSubtitle}>{selectedMember.name}</Text>
                </View>

                <View style={styles.roleOptions}>
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.roleModalOption,
                        selectedMember.role === key && styles.roleModalOptionCurrent
                      ]}
                      onPress={() => handleRoleChange(selectedMember.id, key as CrewMember['role'])}
                    >
                      <View style={styles.roleModalOptionInfo}>
                        <Ionicons name={config.icon as any} size={24} color={config.color} />
                        <View style={styles.roleModalOptionText}>
                          <Text style={styles.roleModalOptionTitle}>{config.label}</Text>
                          {selectedMember.role === key && (
                            <Text style={styles.currentRoleText}>Current Role</Text>
                          )}
                        </View>
                      </View>
                      {selectedMember.role === key && (
                        <Ionicons name="checkmark" size={20} color={config.color} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.roleModalButtons}>
                  <TouchableOpacity 
                    style={styles.roleModalCancel}
                    onPress={() => {
                      setShowRoleModal(false);
                      setSelectedMember(null);
                    }}
                  >
                    <Text style={styles.roleModalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral[900],
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 4,
  },
  crewSection: {
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  crewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  crewInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  memberDetails: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  memberEmail: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  memberMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  lastActive: {
    fontSize: 12,
    color: Colors.status.success,
    fontWeight: '500',
  },
  joinDate: {
    fontSize: 12,
    color: Colors.neutral[500],
  },
  certifications: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  certBadge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  certText: {
    fontSize: 10,
    color: Colors.primary[700],
    fontWeight: '500',
  },
  moreCerts: {
    fontSize: 10,
    color: Colors.neutral[500],
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.neutral[600],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  saveButton: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral[900],
    backgroundColor: Colors.background,
  },
  roleSelector: {
    gap: 8,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    gap: 12,
  },
  roleOptionSelected: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  roleOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  roleOptionTextSelected: {
    color: '#fff',
  },
  permissionsInfo: {
    backgroundColor: Colors.neutral[100],
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  permissionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  permissionsText: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  roleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleModalContent: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    margin: 20,
    maxWidth: 400,
    width: '100%',
  },
  roleModalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  roleModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  roleModalSubtitle: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: 2,
  },
  roleOptions: {
    padding: 20,
  },
  roleModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  roleModalOptionCurrent: {
    backgroundColor: Colors.primary[50],
  },
  roleModalOptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleModalOptionText: {
    flex: 1,
  },
  roleModalOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  currentRoleText: {
    fontSize: 12,
    color: Colors.primary[600],
    marginTop: 2,
  },
  roleModalButtons: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  roleModalCancel: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  roleModalCancelText: {
    fontSize: 16,
    color: Colors.neutral[600],
  },
}); 