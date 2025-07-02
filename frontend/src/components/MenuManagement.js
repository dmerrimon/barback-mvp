import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Menu,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  Tag,
  Image,
  Eye,
  EyeOff,
  Search,
  Filter,
  BookOpen,
  Wine,
  Package
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import BeverageLibrary from './BeverageLibrary';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
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

const FilterBar = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
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
  
  &.secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: var(--bg-hover);
    }
  }
  
  &.danger {
    background-color: var(--error-color);
    color: white;
    
    &:hover {
      background-color: #ff5252;
    }
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const CategoryCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const CategoryTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-hover);
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ItemDescription = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.div`
  color: var(--accent-primary);
  font-weight: 600;
  font-size: 1.1rem;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
`;

const ModalContent = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ModalTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  
  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: var(--spacing-md);
`;

const Label = styled.label`
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
`;

const TextArea = styled.textarea`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
`;

const Select = styled.select`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
`;

const MenuManagement = () => {
  const { success, error: showError } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showBeverageLibrary, setShowBeverageLibrary] = useState(false);
  
  // Mock menu data
  const [menuData, setMenuData] = useState({
    categories: [
      {
        id: 'beer',
        name: 'Beer',
        description: 'Craft beers and lagers',
        isActive: true,
        items: [
          {
            id: 'craft-ipa',
            name: 'Craft IPA',
            description: 'Local brewery IPA with hoppy flavor',
            price: 8.50,
            isActive: true,
            imageUrl: null
          },
          {
            id: 'premium-lager',
            name: 'Premium Lager',
            description: 'Crisp and refreshing lager',
            price: 7.00,
            isActive: true,
            imageUrl: null
          }
        ]
      },
      {
        id: 'cocktails',
        name: 'Cocktails',
        description: 'Signature cocktails and classics',
        isActive: true,
        items: [
          {
            id: 'old-fashioned',
            name: 'Old Fashioned',
            description: 'Classic whiskey cocktail with bitters',
            price: 12.00,
            isActive: true,
            imageUrl: null
          },
          {
            id: 'margarita',
            name: 'Margarita',
            description: 'Fresh lime and premium tequila',
            price: 11.00,
            isActive: true,
            imageUrl: null
          }
        ]
      },
      {
        id: 'food',
        name: 'Food',
        description: 'Bar snacks and entrees',
        isActive: true,
        items: [
          {
            id: 'buffalo-wings',
            name: 'Buffalo Wings',
            description: '8 pieces with celery and blue cheese',
            price: 12.50,
            isActive: true,
            imageUrl: null
          },
          {
            id: 'loaded-nachos',
            name: 'Loaded Nachos',
            description: 'Cheese, jalapeños, sour cream, guacamole',
            price: 11.75,
            isActive: true,
            imageUrl: null
          }
        ]
      }
    ]
  });

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isActive: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      description: '',
      price: '',
      categoryId: menuData.categories[0]?.id || '',
      isActive: true
    });
    setShowItemModal(true);
  };

  const handleEditItem = (categoryId, item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: categoryId,
      isActive: item.isActive
    });
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (!itemForm.name || !itemForm.price || !itemForm.categoryId) {
      showError('Please fill in all required fields');
      return;
    }

    const newItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price),
      isActive: itemForm.isActive,
      imageUrl: null
    };

    setMenuData(prev => ({
      ...prev,
      categories: prev.categories.map(category => {
        if (category.id === itemForm.categoryId) {
          if (editingItem) {
            return {
              ...category,
              items: category.items.map(item => 
                item.id === editingItem.id ? newItem : item
              )
            };
          } else {
            return {
              ...category,
              items: [...category.items, newItem]
            };
          }
        }
        return category;
      })
    }));

    success(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (categoryId, itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuData(prev => ({
        ...prev,
        categories: prev.categories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              items: category.items.filter(item => item.id !== itemId)
            };
          }
          return category;
        })
      }));
      success('Item deleted successfully!');
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      isActive: true
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) {
      showError('Please enter a category name');
      return;
    }

    const newCategory = {
      id: editingCategory?.id || `category-${Date.now()}`,
      name: categoryForm.name,
      description: categoryForm.description,
      isActive: categoryForm.isActive,
      items: editingCategory?.items || []
    };

    if (editingCategory) {
      setMenuData(prev => ({
        ...prev,
        categories: prev.categories.map(category => 
          category.id === editingCategory.id ? newCategory : category
        )
      }));
    } else {
      setMenuData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
    }

    success(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  // Price suggestion logic based on beverage type
  const getSuggestedPrice = (beverage, category) => {
    const categoryLower = category.toLowerCase();
    
    // Beer pricing
    if (categoryLower === 'beer') {
      if (beverage.type?.includes('IPA') || beverage.type?.includes('Imperial')) return 8.50;
      if (beverage.type?.includes('Stout')) return 9.00;
      if (beverage.type?.includes('Lager')) return 6.50;
      return 7.00;
    }
    
    // Wine pricing
    if (categoryLower === 'wine') {
      if (beverage.vintage && beverage.vintage < 2018) return 85.00; // Older vintages
      if (beverage.region?.includes('Napa') || beverage.region?.includes('Burgundy')) return 75.00;
      if (beverage.grape?.includes('Cabernet') || beverage.grape?.includes('Pinot Noir')) return 65.00;
      return 45.00;
    }
    
    // Champagne pricing
    if (categoryLower === 'champagne') {
      if (beverage.type?.includes('Prestige')) return 350.00;
      if (beverage.vintage !== 'NV') return 180.00;
      return 120.00;
    }
    
    // Spirits pricing
    if (categoryLower === 'spirits' || categoryLower === 'whiskey') {
      if (beverage.age && parseInt(beverage.age) >= 18) return 45.00;
      if (beverage.age && parseInt(beverage.age) >= 12) return 28.00;
      if (beverage.proof && beverage.proof >= 100) return 18.00;
      return 14.00;
    }
    
    if (categoryLower === 'vodka' || categoryLower === 'gin') {
      if (beverage.brand?.includes('Premium') || beverage.origin === 'France') return 16.00;
      return 12.00;
    }
    
    if (categoryLower === 'tequila' || categoryLower === 'mezcal') {
      if (beverage.age === 'Añejo') return 22.00;
      if (beverage.age === 'Reposado') return 16.00;
      return 12.00;
    }
    
    if (categoryLower === 'rum') {
      if (beverage.age && parseInt(beverage.age) >= 15) return 25.00;
      if (beverage.style === 'Spiced') return 10.00;
      return 13.00;
    }
    
    if (categoryLower === 'cognac') {
      if (beverage.age === 'XO') return 35.00;
      if (beverage.age === 'VSOP') return 20.00;
      return 15.00;
    }
    
    if (categoryLower === 'liqueurs') {
      return 12.00;
    }
    
    // Cocktails
    if (categoryLower === 'cocktails') {
      return 14.00;
    }
    
    // Non-alcoholic
    if (categoryLower === 'non_alcoholic') {
      if (beverage.type === 'Coffee') return 4.50;
      if (beverage.type?.includes('Energy')) return 5.00;
      return 3.50;
    }
    
    return 10.00; // Default price
  };

  const handleAddFromLibrary = (selectedBeverages) => {
    // Group beverages by category
    const beveragesByCategory = {};
    
    selectedBeverages.forEach(beverage => {
      const categoryName = beverage.category || 'Other';
      if (!beveragesByCategory[categoryName]) {
        beveragesByCategory[categoryName] = [];
      }
      beveragesByCategory[categoryName].push(beverage);
    });

    setMenuData(prev => {
      const newCategories = [...prev.categories];
      
      Object.entries(beveragesByCategory).forEach(([categoryName, beverages]) => {
        // Find or create category
        let category = newCategories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
        
        if (!category) {
          // Create new category
          category = {
            id: `category-${Date.now()}-${categoryName}`,
            name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
            description: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} beverages`,
            isActive: true,
            items: []
          };
          newCategories.push(category);
        }
        
        // Add beverages to category
        beverages.forEach(beverage => {
          // Suggest price based on beverage type and category
          const suggestedPrice = getSuggestedPrice(beverage, categoryName);
          
          const newItem = {
            id: `item-${Date.now()}-${Math.random()}`,
            name: beverage.name,
            description: `${beverage.brand} - ${beverage.origin || 'Premium selection'}${beverage.abv ? ` (${beverage.abv}% ABV)` : ''}${beverage.proof ? ` (${beverage.proof} proof)` : ''}`,
            price: suggestedPrice,
            isActive: true,
            imageUrl: null,
            beverageData: beverage // Store original beverage data
          };
          
          category.items.push(newItem);
        });
      });
      
      return { ...prev, categories: newCategories };
    });
    
    setShowBeverageLibrary(false);
  };

  const filteredCategories = menuData.categories.filter(category => {
    if (activeFilter === 'active' && !category.isActive) return false;
    if (activeFilter === 'inactive' && category.isActive) return false;
    if (searchTerm) {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.items.some(item => 
               item.name.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    return true;
  });

  return (
    <MenuContainer>
      <MenuHeader>
        <SearchBar>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <FilterBar>
          <FilterButton
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => setActiveFilter('all')}
          >
            All Items
          </FilterButton>
          <FilterButton
            className={activeFilter === 'active' ? 'active' : ''}
            onClick={() => setActiveFilter('active')}
          >
            Active
          </FilterButton>
          <FilterButton
            className={activeFilter === 'inactive' ? 'active' : ''}
            onClick={() => setActiveFilter('inactive')}
          >
            Inactive
          </FilterButton>
        </FilterBar>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <ActionButton className="secondary" onClick={() => setShowBeverageLibrary(true)}>
            <BookOpen size={16} />
            Beverage Library
          </ActionButton>
          <ActionButton className="secondary" onClick={handleAddCategory}>
            <Plus size={16} />
            Add Category
          </ActionButton>
          <ActionButton className="primary" onClick={handleAddItem}>
            <Plus size={16} />
            Add Item
          </ActionButton>
        </div>
      </MenuHeader>

      <CategoriesGrid>
        {filteredCategories.map(category => (
          <CategoryCard key={category.id}>
            <CategoryHeader>
              <CategoryTitle>
                <Menu size={20} />
                {category.name}
                {!category.isActive && (
                  <EyeOff size={16} style={{ color: 'var(--text-muted)' }} />
                )}
              </CategoryTitle>
              <CategoryActions>
                <ActionButton 
                  className="secondary" 
                  style={{ padding: '0.5rem' }}
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit size={14} />
                </ActionButton>
              </CategoryActions>
            </CategoryHeader>
            
            {category.description && (
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem', 
                marginBottom: 'var(--spacing-md)' 
              }}>
                {category.description}
              </p>
            )}
            
            <ItemsList>
              {category.items.map(item => (
                <MenuItem key={item.id}>
                  <ItemInfo>
                    <ItemName>
                      {item.name}
                      {!item.isActive && (
                        <EyeOff size={14} style={{ 
                          marginLeft: '0.5rem', 
                          color: 'var(--text-muted)' 
                        }} />
                      )}
                    </ItemName>
                    {item.description && (
                      <ItemDescription>{item.description}</ItemDescription>
                    )}
                    <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                  </ItemInfo>
                  <ItemActions>
                    <ActionButton 
                      className="secondary" 
                      style={{ padding: '0.5rem' }}
                      onClick={() => handleEditItem(category.id, item)}
                    >
                      <Edit size={14} />
                    </ActionButton>
                    <ActionButton 
                      className="danger" 
                      style={{ padding: '0.5rem' }}
                      onClick={() => handleDeleteItem(category.id, item.id)}
                    >
                      <Trash2 size={14} />
                    </ActionButton>
                  </ItemActions>
                </MenuItem>
              ))}
              
              {category.items.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: 'var(--spacing-lg)', 
                  color: 'var(--text-muted)' 
                }}>
                  No items in this category
                </div>
              )}
            </ItemsList>
          </CategoryCard>
        ))}
      </CategoriesGrid>

      {/* Item Modal */}
      {showItemModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </ModalTitle>
              <CloseButton onClick={() => setShowItemModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <FormField>
              <Label>Item Name *</Label>
              <Input
                type="text"
                value={itemForm.name}
                onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </FormField>
            
            <FormField>
              <Label>Description</Label>
              <TextArea
                value={itemForm.description}
                onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description"
              />
            </FormField>
            
            <FormField>
              <Label>Price *</Label>
              <Input
                type="number"
                step="0.01"
                value={itemForm.price}
                onChange={(e) => setItemForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </FormField>
            
            <FormField>
              <Label>Category *</Label>
              <Select
                value={itemForm.categoryId}
                onChange={(e) => setItemForm(prev => ({ ...prev, categoryId: e.target.value }))}
              >
                {menuData.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormField>
            
            <FormField>
              <Label>
                <input
                  type="checkbox"
                  checked={itemForm.isActive}
                  onChange={(e) => setItemForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Active (visible to customers)
              </Label>
            </FormField>
            
            <ModalActions>
              <ActionButton className="secondary" onClick={() => setShowItemModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton className="primary" onClick={handleSaveItem}>
                <Save size={16} />
                {editingItem ? 'Update Item' : 'Add Item'}
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </ModalTitle>
              <CloseButton onClick={() => setShowCategoryModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <FormField>
              <Label>Category Name *</Label>
              <Input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </FormField>
            
            <FormField>
              <Label>Description</Label>
              <TextArea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
              />
            </FormField>
            
            <FormField>
              <Label>
                <input
                  type="checkbox"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Active (visible to customers)
              </Label>
            </FormField>
            
            <ModalActions>
              <ActionButton className="secondary" onClick={() => setShowCategoryModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton className="primary" onClick={handleSaveCategory}>
                <Save size={16} />
                {editingCategory ? 'Update Category' : 'Add Category'}
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* Beverage Library Modal */}
      {showBeverageLibrary && (
        <Modal>
          <ModalContent style={{ maxWidth: '95vw', maxHeight: '95vh', width: '95vw' }}>
            <ModalHeader>
              <ModalTitle>Beverage Library</ModalTitle>
              <CloseButton onClick={() => setShowBeverageLibrary(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <div style={{ height: '80vh' }}>
              <BeverageLibrary
                onAddSelected={handleAddFromLibrary}
                onClose={() => setShowBeverageLibrary(false)}
              />
            </div>
          </ModalContent>
        </Modal>
      )}
    </MenuContainer>
  );
};

export default MenuManagement;