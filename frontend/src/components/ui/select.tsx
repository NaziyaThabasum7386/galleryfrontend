import * as React from 'react';

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

const useSelectContext = (): SelectContextValue => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select');
  }
  return context;
};

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({ value, onValueChange, children, disabled }: SelectProps): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen: disabled ? () => {} : setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SelectTrigger({ children, className = '', ...props }: SelectTriggerProps): JSX.Element {
  const { open, setOpen } = useSelectContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
      <svg
        className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps): JSX.Element {
  const { value } = useSelectContext();
  return <span>{value || placeholder}</span>;
}

interface SelectContentProps {
  children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps): JSX.Element | null {
  const { open, setOpen } = useSelectContext();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (!target.closest('[role="listbox"]') && !target.closest('button')) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      role="listbox"
      className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      {children}
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps): JSX.Element {
  const { value: selectedValue, onValueChange, setOpen } = useSelectContext();

  const handleClick = (): void => {
    onValueChange(value);
    setOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
        selectedValue === value ? 'bg-blue-50 text-blue-600' : ''
      }`}
    >
      {children}
    </div>
  );
}
