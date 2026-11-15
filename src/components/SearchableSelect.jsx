import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

export default function SearchableSelect({ id, label, groups, value, onChange, placeholder, searchPlaceholder = 'Search rooms, codes, buildings…', emptyMessage = 'No matches found', emptyHint = 'Try a different name, code, or building.' }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const listId = `${inputId}-list`;
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const selected = groups.flatMap(group => group.options).find(option => option.value === value);
  const filteredGroups = useMemo(() => {
    const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    return groups.map(group => ({
      ...group,
      options: group.options.filter(option => {
        const text = `${group.label} ${option.label} ${option.code || ''} ${option.description || ''}`.toLocaleLowerCase();
        return terms.every(term => text.includes(term));
      }),
    })).filter(group => group.options.length);
  }, [groups, query]);
  const options = filteredGroups.flatMap(group => group.options);
  const selectableOptions = options.filter(option => !option.disabled);
  const activeOption = selectableOptions[activeIndex];
  const optionId = option => `${listId}-${encodeURIComponent(option.value)}`;

  useEffect(() => {
    if (open && activeOption) {
      listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeOption]);

  const show = () => {
    if (open) return;
    setQuery('');
    setActiveIndex(groups.flatMap(group => group.options).filter(option => !option.disabled).findIndex(option => option.value === value));
    setOpen(true);
  };
  const close = () => { setOpen(false); setQuery(''); setActiveIndex(-1); };
  const choose = option => {
    if (option.disabled) return;
    onChange(option.value);
    close();
    inputRef.current?.focus();
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      close();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) { show(); return; }
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex(index => selectableOptions.length ? (index + direction + selectableOptions.length) % selectableOptions.length : -1);
    } else if (open && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      setActiveIndex(event.key === 'Home' ? 0 : selectableOptions.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (!open) show();
      else if (activeOption) choose(activeOption);
    }
  };

  return (
    <div className={`searchable-select ${open ? 'is-open' : ''}`}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
      <div className="searchable-select-control">
        <input ref={inputRef} id={inputId} className="searchable-select-input" role="combobox"
          aria-label={label} aria-expanded={open} aria-controls={open ? listId : undefined}
          aria-autocomplete="list" aria-activedescendant={open && activeOption ? optionId(activeOption) : undefined}
          autoComplete="off" spellCheck={false} placeholder={open ? searchPlaceholder : placeholder}
          value={open ? query : selected?.label || ''} title={selected ? `${selected.label}${selected.code ? ` (${selected.code})` : ''}` : undefined}
          onClick={show} onKeyDown={handleKeyDown}
          onChange={event => { setOpen(true); setQuery(event.target.value); setActiveIndex(0); }} />
        <button type="button" className="searchable-select-toggle" aria-label={`${open ? 'Close' : 'Open'} ${label.toLowerCase()} options`}
          tabIndex={-1} onClick={() => { inputRef.current?.focus(); if (open) close(); else show(); }}>
          <ChevronDown size={15} aria-hidden="true" />
        </button>
      </div>
      {open && <div className="searchable-select-menu" onMouseDown={event => event.preventDefault()}>
        <div className="searchable-select-summary">
          <Search size={14} aria-hidden="true" />
          <span role="status">{options.length} {options.length === 1 ? 'result' : 'results'}</span>
          {value && <button type="button" className="searchable-select-clear" onClick={() => choose({ value: '' })}>
            <X size={12} aria-hidden="true" /> Clear
          </button>}
        </div>
        <div ref={listRef} id={listId} className="searchable-select-options" role="listbox" aria-label={label}>
          {filteredGroups.map((group, groupIndex) => <div key={group.label} role="group" aria-labelledby={`${listId}-group-${groupIndex}`}>
            <div id={`${listId}-group-${groupIndex}`} className="searchable-select-group">{group.label}</div>
            {group.options.map(option => <div key={option.value} id={optionId(option)} role="option"
              aria-selected={option.value === value} aria-disabled={option.disabled || undefined} data-active={option === activeOption}
              className="searchable-select-option" onClick={() => choose(option)}
              onMouseEnter={() => setActiveIndex(selectableOptions.indexOf(option))}>
              <span className="searchable-select-option-label">{option.label}
                {option.description && <span className="searchable-select-description">{option.description}</span>}
              </span>
              {option.code && <span className="searchable-select-code">{option.code}</span>}
              {option.value === value && <Check size={15} className="searchable-select-check" aria-hidden="true" />}
            </div>)}
          </div>)}
        </div>
        {!options.length && <div className="searchable-select-empty" role="status"><Search size={22} aria-hidden="true" /><strong>{emptyMessage}</strong><span>{emptyHint}</span></div>}
        <div className="searchable-select-hint">↑ ↓ to browse · Enter to select · Esc to close</div>
      </div>}
    </div>
  );
}
