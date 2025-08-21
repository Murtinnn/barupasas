import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BarFiltersModal = ({ 
  visible, 
  onClose, 
  onApply, 
  categories = [], 
  tags = [], 
  routes = [],
  initialFilters = {},
  userLocation,
  fetchCategoriesData,
  fetchTagsData,
  fetchRoutesData
}) => {
  const [filters, setFilters] = useState(() => ({
    cities: initialFilters.cities || [],
    tags: initialFilters.tags || [],
    routes: initialFilters.routes || []
  }));

  // Load data only when modal opens for faster initial navigation
  useEffect(() => {
    if (visible && fetchCategoriesData && fetchTagsData && fetchRoutesData) {
      fetchCategoriesData();
      fetchTagsData();
      fetchRoutesData();
    }
  }, [visible]);

  const toggleCity = (cityId) => {
    console.log('Toggle city clicked:', cityId);
    setFilters(prev => {
      console.log('Previous filters:', prev);
      const newCities = prev.cities.includes(cityId) 
        ? prev.cities.filter(id => id !== cityId)
        : [...prev.cities, cityId];
      console.log('New cities:', newCities);
      return {
        ...prev,
        cities: newCities
      };
    });
  };

  const toggleTag = (tagId) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) 
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const toggleRoute = (routeId) => {
    setFilters(prev => ({
      ...prev,
      routes: prev.routes.includes(routeId) 
        ? prev.routes.filter(id => id !== routeId)
        : [...prev.routes, routeId]
    }));
  };

  const clearFilters = () => {
    setFilters({
      cities: [],
      tags: [],
      routes: []
    });
  };

  const handleApply = () => {
    // Sukuriame API parametrus identiškai kaip web versijoje
    const apiParams = {};
    
    if (filters.cities.length > 0) {
      apiParams.city = filters.cities;
    }
    if (filters.tags.length > 0) {
      apiParams.tag = filters.tags;
    }
    if (filters.routes.length > 0) {
      apiParams.route = filters.routes;
    }
    if (userLocation) {
      apiParams.lat = userLocation.coords.latitude;
      apiParams.lng = userLocation.coords.longitude;
    }


    onApply(apiParams);
    onClose();
  };

  const FilterChip = ({ 
    label, 
    selected, 
    onPress, 
    icon = null 
  }) => (
    <TouchableOpacity
      style={[styles.filterChip, selected && styles.filterChipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {selected && (
        <Ionicons 
          name="checkmark" 
          size={16} 
          color="#ffffff" 
          style={styles.checkmark}
        />
      )}
      <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
        {label}
      </Text>
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={selected ? "#ffffff" : "#6b7280"} 
          style={styles.chipIcon}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filtrai</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Miestų filtras */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Miestas</Text>
            <View style={styles.chipsContainer}>
              {categories.map((category) => (
                <FilterChip
                  key={category.id}
                  label={category.name}
                  selected={filters.cities.includes(category.id)}
                  onPress={() => toggleCity(category.id)}
                />
              ))}
            </View>
          </View>

          {/* Žymų filtras */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Žymos</Text>
            <View style={styles.chipsContainer}>
              {tags.map((tag) => (
                <FilterChip
                  key={tag.id}
                  label={tag.name}
                  selected={filters.tags.includes(tag.id)}
                  onPress={() => toggleTag(tag.id)}
                  icon="pricetag"
                />
              ))}
            </View>
          </View>

          {/* Maršrutų filtras */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Rekomenduotini maršrutai</Text>
            <View style={styles.chipsContainer}>
              {routes.map((route) => (
                <FilterChip
                  key={route.id}
                  label={route.name}
                  selected={filters.routes.includes(route.id)}
                  onPress={() => toggleRoute(route.id)}
                  icon="map"
                />
              ))}
            </View>
          </View>


        </ScrollView>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Išvalyti</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Taikyti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a3848',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f4a60',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004259',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  checkmark: {
    marginRight: 6,
  },
  filterChipText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  filterChipTextSelected: {
    fontWeight: '700',
  },
  chipIcon: {
    marginLeft: 6,
  },

  actions: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#9ca3af',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BarFiltersModal;
