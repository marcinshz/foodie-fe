import './ShoppingList.scss';
import { ShoppingList as ShoppingListType, ShoppingListItem } from '../../types';
import { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { IconButton } from '@mui/material';
import { pinShoppingList, unpinShoppingList, updateShoppingListItemChecked } from '../../DataService';

type ShoppingListProps = {
    shoppingList: ShoppingListType;
    listNumber: number;
    totalLists: number;
    onPinChange?: () => void; // Callback when pin status changes
}

const categoryIcons: Record<string, string> = {
    'Produce': '🥬',
    'Dairy': '🧀',
    'Meat': '🥩',
    'Fish': '🐟',
    'Pantry': '🏺',
    'Frozen': '❄️',
    'Other': '🛒'
};

function ShoppingList({ shoppingList, listNumber, totalLists, onPinChange }: ShoppingListProps) {
    const [items, setItems] = useState<ShoppingListItem[]>(shoppingList.items);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
        {} // All categories start collapsed
    );
    const [isPinned, setIsPinned] = useState(shoppingList.isPinned || false);
    const [isPinning, setIsPinning] = useState(false);

    // Update items when shoppingList prop changes (e.g., after refresh)
    useEffect(() => {
        setItems(shoppingList.items);
    }, [shoppingList.items]);

    const toggleItem = async (index: number) => {
        const newChecked = !items[index].checked;
        
        // Optimistically update UI
        setItems(prev => prev.map((item, i) => 
            i === index ? { ...item, checked: newChecked } : item
        ));

        // Save to backend if shopping list has an ID
        if (shoppingList.id) {
            try {
                await updateShoppingListItemChecked(shoppingList.id, index, newChecked);
            } catch (error) {
                console.error('Failed to update item status:', error);
                // Revert on error
                setItems(prev => prev.map((item, i) => 
                    i === index ? { ...item, checked: !newChecked } : item
                ));
            }
        }
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handlePinToggle = async () => {
        if (!shoppingList.id || isPinning) return;
        
        setIsPinning(true);
        try {
            if (isPinned) {
                await unpinShoppingList(shoppingList.id);
                setIsPinned(false);
            } else {
                await pinShoppingList(shoppingList.id);
                setIsPinned(true);
            }
            if (onPinChange) {
                onPinChange();
            }
        } catch (error) {
            console.error('Failed to toggle pin:', error);
            alert('Failed to update pin status');
        } finally {
            setIsPinning(false);
        }
    };

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, ShoppingListItem[]>);

    const checkedCount = items.filter(item => item.checked).length;
    const totalCount = items.length;

    return (
        <div className="shopping-list">
            <div className="shopping-list__paper">
                {/* Header */}
                <div className="shopping-list__header">
                    <div className="shopping-list__header__title-section">
                        <LocalGroceryStoreIcon className="shopping-list__header__icon" />
                        <div>
                            <h3>
                                {shoppingList.mealPlanTitle ? shoppingList.mealPlanTitle : 'Shopping List'} 
                                {totalLists > 1 ? ` #${listNumber}` : ''}
                            </h3>
                            <p className="shopping-list__header__subtitle">
                                {totalCount} items • {checkedCount} checked
                            </p>
                        </div>
                    </div>
                    <div className="shopping-list__header__actions">
                        {shoppingList.id && (
                            <IconButton
                                onClick={handlePinToggle}
                                disabled={isPinning}
                                className="shopping-list__pin-button"
                                title={isPinned ? "Unpin from Lists Board" : "Pin to Lists Board"}
                            >
                                {isPinned ? (
                                    <PushPinIcon sx={{ color: '#757bc8' }} />
                                ) : (
                                    <PushPinOutlinedIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                                )}
                            </IconButton>
                        )}
                        <div className="shopping-list__progress">
                            <div className="shopping-list__progress__bar">
                                <div 
                                    className="shopping-list__progress__fill"
                                    style={{ width: `${(checkedCount / totalCount) * 100}%` }}
                                />
                            </div>
                            <span className="shopping-list__progress__text">
                                {Math.round((checkedCount / totalCount) * 100)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Shopping Info */}
                <div className="shopping-list__info">
                    <div className="shopping-list__info__item">
                        <CalendarTodayIcon fontSize="small" />
                        <span>Shop on Day {shoppingList.shoppingDay}</span>
                    </div>
                    <div className="shopping-list__info__item">
                        <AccessTimeIcon fontSize="small" />
                        <span>Valid for Days {shoppingList.validForDays[0]}-{shoppingList.validForDays[shoppingList.validForDays.length - 1]}</span>
                    </div>
                </div>

                {/* Items by Category */}
                <div className="shopping-list__categories">
                    {Object.entries(groupedItems).map(([category, categoryItems]) => {
                        const isExpanded = expandedCategories[category];
                        return (
                            <div key={category} className="shopping-list__category">
                                <h4 
                                    className="shopping-list__category__title"
                                    onClick={() => toggleCategory(category)}
                                >
                                    <div className="shopping-list__category__title__left">
                                        <span className="shopping-list__category__icon">
                                            {categoryIcons[category]}
                                        </span>
                                        {category}
                                        <span className="shopping-list__category__count">
                                            ({categoryItems.filter(i => i.checked).length}/{categoryItems.length})
                                        </span>
                                    </div>
                                    <div className="shopping-list__category__expand">
                                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </div>
                                </h4>
                                {isExpanded && (
                                    <div className="shopping-list__items">
                                        {categoryItems.map((item) => {
                                            const globalIndex = items.findIndex(i => i === item);
                                            return (
                                                <div 
                                                    key={globalIndex}
                                                    className={`shopping-list__item ${item.checked ? 'shopping-list__item--checked' : ''}`}
                                                    onClick={() => toggleItem(globalIndex)}
                                                >
                                                    <div className="shopping-list__item__checkbox">
                                                        {item.checked ? (
                                                            <CheckCircleIcon className="shopping-list__item__checkbox__icon--checked" />
                                                        ) : (
                                                            <RadioButtonUncheckedIcon className="shopping-list__item__checkbox__icon" />
                                                        )}
                                                    </div>
                                                    <div className="shopping-list__item__content">
                                                        <span className="shopping-list__item__name">
                                                            {item.ingredient}
                                                        </span>
                                                        <div className="shopping-list__item__details">
                                                            <span className="shopping-list__item__detail">
                                                                Use by Day {Math.max(...item.usedInDays)}
                                                            </span>
                                                            <span className="shopping-list__item__detail shopping-list__item__detail--shelf">
                                                                {item.estimatedShelfLife} days shelf life
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Paper Decoration */}
                <div className="shopping-list__decoration">
                    <div className="shopping-list__decoration__hole"></div>
                    <div className="shopping-list__decoration__hole"></div>
                    <div className="shopping-list__decoration__hole"></div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingList;

