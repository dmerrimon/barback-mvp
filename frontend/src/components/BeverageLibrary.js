import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Search,
  Filter,
  Plus,
  Wine,
  Coffee,
  Droplets,
  Star,
  Check,
  X,
  ChevronDown,
  Grid,
  List,
  BookOpen,
  Package,
  Eye,
  DollarSign
} from 'lucide-react';
import beverageDatabase from '../data/beverageDatabase';
import { useToast } from '../contexts/ToastContext';

const LibraryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  height: 80vh;
`;

const LibraryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const SearchSection = styled.div`
  display: flex;
  gap: var(--spacing-md);
  flex: 1;
  max-width: 600px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const FilterControls = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 0.25rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  
  &.active {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
  }
  
  &:hover:not(.active) {
    background-color: var(--bg-hover);
  }
`;

const FilterDropdown = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  &.active {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    border-color: var(--accent-primary);
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin-top: 0.5rem;
  padding: var(--spacing-md);
  z-index: 100;
  box-shadow: var(--shadow-lg);
  min-width: 250px;
`;

const FilterSection = styled.div`
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 0.9rem;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  input {
    margin: 0;
  }
`;

const ContentArea = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  flex: 1;
  overflow: hidden;
`;

const CategorySidebar = styled.div`
  width: 250px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const CategoryItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  
  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
  
  &.active {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
  }
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  
  .active & {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const CategoryCount = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
`;

const BeverageGrid = styled.div`
  flex: 1;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const BeverageCard = styled.div`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-primary);
  }
  
  &.selected {
    border-color: var(--accent-primary);
    background-color: rgba(0, 212, 170, 0.1);
  }
`;

const BeverageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
`;

const BeverageName = styled.h4`
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const BeverageBrand = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const SelectButton = styled.button`
  padding: 0.25rem 0.75rem;
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--accent-hover);
  }
  
  &.selected {
    background-color: var(--success-color);
  }
`;

const BeverageDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  font-size: 0.85rem;
`;

const DetailItem = styled.div`
  color: var(--text-secondary);
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: var(--text-primary);
`;

const SelectedCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  font-weight: 500;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  &.primary {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    
    &:hover {
      background-color: var(--accent-hover);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BeverageLibrary = ({ onAddSelected, onClose }) => {
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('beer');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBeverages, setSelectedBeverages] = useState(new Set());
  
  const [filters, setFilters] = useState({
    origin: [],
    abv: [],
    proof: [],
    style: [],
    type: []
  });

  const categories = [
    { 
      id: 'beer', 
      name: 'Beer', 
      icon: <Package size={16} />,
      subcategories: ['lagers', 'ipas', 'stouts', 'wheat_beers'],
      count: Object.values(beverageDatabase.beer).flat().length
    },
    { 
      id: 'wine', 
      name: 'Wine', 
      icon: <Wine size={16} />,
      subcategories: ['red_wines', 'white_wines', 'rosé_wines'],
      count: Object.values(beverageDatabase.wine).flat().length
    },
    { 
      id: 'champagne', 
      name: 'Champagne & Sparkling', 
      icon: <Star size={16} />,
      subcategories: ['champagne', 'sparkling'],
      count: Object.values(beverageDatabase.champagne).flat().length
    },
    { 
      id: 'spirits', 
      name: 'Whiskey', 
      icon: <Droplets size={16} />,
      subcategories: ['bourbon', 'scotch', 'rye_whiskey', 'irish_whiskey'],
      count: Object.values(beverageDatabase.spirits).flat().length
    },
    { 
      id: 'vodka', 
      name: 'Vodka', 
      icon: <Droplets size={16} />,
      subcategories: [],
      count: beverageDatabase.vodka.length
    },
    { 
      id: 'gin', 
      name: 'Gin', 
      icon: <Droplets size={16} />,
      subcategories: [],
      count: beverageDatabase.gin.length
    },
    { 
      id: 'rum', 
      name: 'Rum', 
      icon: <Droplets size={16} />,
      subcategories: [],
      count: beverageDatabase.rum.length
    },
    { 
      id: 'tequila', 
      name: 'Tequila', 
      icon: <Droplets size={16} />,
      subcategories: [],
      count: beverageDatabase.tequila.length
    },
    { 
      id: 'mezcal', 
      name: 'Mezcal', 
      icon: <Droplets size={16} />,
      subcategories: [],
      count: beverageDatabase.mezcal.length
    },
    { 
      id: 'cognac', 
      name: 'Cognac & Brandy', 
      icon: <Droplets size={16} />,
      subcategories: [],
      count: beverageDatabase.cognac.length
    },
    { 
      id: 'liqueurs', 
      name: 'Liqueurs', 
      icon: <Droplets size={16} />,
      subcategories: [],
      count: beverageDatabase.liqueurs.length
    },
    { 
      id: 'cocktails', 
      name: 'Classic Cocktails', 
      icon: <Wine size={16} />,
      subcategories: ['whiskey_cocktails', 'gin_cocktails', 'vodka_cocktails', 'rum_cocktails', 'tequila_cocktails'],
      count: Object.values(beverageDatabase.cocktails).flat().length
    },
    { 
      id: 'non_alcoholic', 
      name: 'Non-Alcoholic', 
      icon: <Coffee size={16} />,
      subcategories: ['sodas', 'juices', 'energy_drinks', 'coffee', 'tea', 'water'],
      count: Object.values(beverageDatabase.non_alcoholic).flat().length
    }
  ];

  const getCurrentBeverages = () => {
    let beverages = [];
    
    if (selectedCategory === 'beer' || selectedCategory === 'wine' || selectedCategory === 'champagne' || selectedCategory === 'spirits' || selectedCategory === 'cocktails' || selectedCategory === 'non_alcoholic') {
      const categoryData = beverageDatabase[selectedCategory];
      if (selectedSubcategory && categoryData[selectedSubcategory]) {
        beverages = categoryData[selectedSubcategory];
      } else {
        beverages = Object.values(categoryData).flat();
      }
    } else {
      beverages = beverageDatabase[selectedCategory] || [];
    }

    // Apply search filter
    if (searchTerm) {
      beverages = beverages.filter(beverage => 
        beverage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beverage.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return beverages;
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
  };

  const handleBeverageSelect = (beverage, index) => {
    const beverageId = `${selectedCategory}-${selectedSubcategory}-${index}`;
    const newSelected = new Set(selectedBeverages);
    
    if (newSelected.has(beverageId)) {
      newSelected.delete(beverageId);
    } else {
      newSelected.add(beverageId);
    }
    
    setSelectedBeverages(newSelected);
  };

  const handleAddSelected = () => {
    const selectedItems = [];
    const currentBeverages = getCurrentBeverages();
    
    selectedBeverages.forEach(beverageId => {
      const [category, subcategory, index] = beverageId.split('-');
      const beverage = currentBeverages[parseInt(index)];
      if (beverage) {
        selectedItems.push({
          ...beverage,
          category: selectedCategory,
          subcategory: selectedSubcategory
        });
      }
    });

    onAddSelected(selectedItems);
    success(`Added ${selectedItems.length} beverage(s) to menu`);
    setSelectedBeverages(new Set());
  };

  const filteredSubcategories = categories.find(cat => cat.id === selectedCategory)?.subcategories || [];

  return (
    <LibraryContainer>
      <LibraryHeader>
        <SearchSection>
          <SearchContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search beverages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          {filteredSubcategories.length > 0 && (
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="">All {categories.find(cat => cat.id === selectedCategory)?.name}</option>
              {filteredSubcategories.map(sub => (
                <option key={sub} value={sub}>
                  {sub.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          )}
        </SearchSection>

        <FilterControls>
          {selectedBeverages.size > 0 && (
            <SelectedCounter>
              <Check size={16} />
              {selectedBeverages.size} selected
            </SelectedCounter>
          )}
          
          <ViewToggle>
            <ViewButton 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </ViewButton>
            <ViewButton 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </ViewButton>
          </ViewToggle>

          <ActionButton 
            className="primary" 
            onClick={handleAddSelected}
            disabled={selectedBeverages.size === 0}
          >
            <Plus size={16} />
            Add Selected ({selectedBeverages.size})
          </ActionButton>
        </FilterControls>
      </LibraryHeader>

      <ContentArea>
        <CategorySidebar>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--spacing-md) 0' }}>
              Beverage Categories
            </h3>
          </div>
          
          <CategoryList>
            {categories.map(category => (
              <CategoryItem
                key={category.id}
                className={selectedCategory === category.id ? 'active' : ''}
                onClick={() => handleCategoryChange(category.id)}
              >
                <CategoryIcon>
                  {category.icon}
                </CategoryIcon>
                <CategoryInfo>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryCount>{category.count} items</CategoryCount>
                </CategoryInfo>
              </CategoryItem>
            ))}
          </CategoryList>
        </CategorySidebar>

        <BeverageGrid>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>
              {categories.find(cat => cat.id === selectedCategory)?.name}
              {selectedSubcategory && ` - ${selectedSubcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              {getCurrentBeverages().length} beverages available
            </p>
          </div>

          {viewMode === 'grid' ? (
            <GridView>
              {getCurrentBeverages().map((beverage, index) => {
                const beverageId = `${selectedCategory}-${selectedSubcategory}-${index}`;
                const isSelected = selectedBeverages.has(beverageId);
                
                return (
                  <BeverageCard
                    key={index}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => handleBeverageSelect(beverage, index)}
                  >
                    <BeverageHeader>
                      <div>
                        <BeverageName>{beverage.name}</BeverageName>
                        <BeverageBrand>{beverage.brand}</BeverageBrand>
                      </div>
                      <SelectButton className={isSelected ? 'selected' : ''}>
                        {isSelected ? <Check size={12} /> : <Plus size={12} />}
                      </SelectButton>
                    </BeverageHeader>
                    
                    <BeverageDetails>
                      {beverage.abv && (
                        <DetailItem>
                          <DetailLabel>ABV:</DetailLabel> {beverage.abv}%
                        </DetailItem>
                      )}
                      {beverage.proof && (
                        <DetailItem>
                          <DetailLabel>Proof:</DetailLabel> {beverage.proof}
                        </DetailItem>
                      )}
                      {beverage.origin && (
                        <DetailItem>
                          <DetailLabel>Origin:</DetailLabel> {beverage.origin}
                        </DetailItem>
                      )}
                      {beverage.type && (
                        <DetailItem>
                          <DetailLabel>Type:</DetailLabel> {beverage.type}
                        </DetailItem>
                      )}
                      {beverage.vintage && (
                        <DetailItem>
                          <DetailLabel>Vintage:</DetailLabel> {beverage.vintage}
                        </DetailItem>
                      )}
                      {beverage.region && (
                        <DetailItem>
                          <DetailLabel>Region:</DetailLabel> {beverage.region}
                        </DetailItem>
                      )}
                      {beverage.age && (
                        <DetailItem>
                          <DetailLabel>Age:</DetailLabel> {beverage.age}
                        </DetailItem>
                      )}
                    </BeverageDetails>
                  </BeverageCard>
                );
              })}
            </GridView>
          ) : (
            <ListView>
              {getCurrentBeverages().map((beverage, index) => {
                const beverageId = `${selectedCategory}-${selectedSubcategory}-${index}`;
                const isSelected = selectedBeverages.has(beverageId);
                
                return (
                  <BeverageCard
                    key={index}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => handleBeverageSelect(beverage, index)}
                    style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flex: 1 }}>
                        <div>
                          <BeverageName>{beverage.name}</BeverageName>
                          <BeverageBrand>{beverage.brand}</BeverageBrand>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '0.85rem' }}>
                          {beverage.abv && <DetailItem><DetailLabel>ABV:</DetailLabel> {beverage.abv}%</DetailItem>}
                          {beverage.origin && <DetailItem><DetailLabel>Origin:</DetailLabel> {beverage.origin}</DetailItem>}
                          {beverage.type && <DetailItem><DetailLabel>Type:</DetailLabel> {beverage.type}</DetailItem>}
                        </div>
                      </div>
                      <SelectButton className={isSelected ? 'selected' : ''}>
                        {isSelected ? <Check size={12} /> : <Plus size={12} />}
                      </SelectButton>
                    </div>
                  </BeverageCard>
                );
              })}
            </ListView>
          )}
          
          {getCurrentBeverages().length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: 'var(--text-muted)' 
            }}>
              No beverages found matching your criteria
            </div>
          )}
        </BeverageGrid>
      </ContentArea>
    </LibraryContainer>
  );
};

export default BeverageLibrary;