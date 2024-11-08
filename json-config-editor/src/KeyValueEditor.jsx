import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';


const KeyValueEditor = ({ items = [], onChange, label }) => {
    const addItem = () => {
      onChange([...items, { key: '', value: '' }]);
    };
  
    const removeItem = (index) => {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
    };
  
    const updateItem = (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      onChange(newItems);
    };
  
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Key"
              value={item.key}
              onChange={(e) => updateItem(index, 'key', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={item.value}
              onChange={(e) => updateItem(index, 'value', e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    );
  };

export default KeyValueEditor;