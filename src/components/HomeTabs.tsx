import { useEffect, useRef, type KeyboardEvent, type RefObject } from 'react';

export type HomeTab = 'dashboard' | 'path' | 'missions' | 'stories' | 'culture' | 'phrasebook';
const TAB_IDS: HomeTab[] = ['dashboard', 'path', 'missions', 'stories', 'culture', 'phrasebook'];

/** The tab named in the address (#path, #missions, …), so a reload or a finished lesson returns to it. */
export function initialTab(): HomeTab {
  const hash = typeof window === 'undefined' ? '' : window.location.hash.slice(1);
  return TAB_IDS.includes(hash as HomeTab) ? (hash as HomeTab) : 'dashboard';
}

type Props = {
  tabs: { id: HomeTab; label: string; icon: string; count?: string }[];
  active: HomeTab;
  onSelect: (tab: HomeTab) => void;
  barRef: RefObject<HTMLDivElement>;
};

/** The home screen's sections as tabs; on phones the row scrolls sideways instead of the page growing. */
export function HomeTabs({ tabs, active, onSelect, barRef }: Props) {
  const buttons = useRef<Map<HomeTab, HTMLButtonElement>>(new Map());

  // Keep the chosen tab visible in the scrolling row.
  useEffect(() => {
    buttons.current.get(active)?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [active]);

  /** Arrow keys, Home and End move between tabs, as in any tab list. */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.id === active);
    const target =
      event.key === 'ArrowRight' ? (index + 1) % tabs.length
      : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? tabs.length - 1
      : -1;
    if (target < 0) return;
    event.preventDefault();
    onSelect(tabs[target].id);
    buttons.current.get(tabs[target].id)?.focus();
  };

  return (
    <div className="home-tabs-bar" ref={barRef}>
      <div className="home-tabs" role="tablist" aria-label="Home sections" onKeyDown={onKeyDown}>
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) buttons.current.set(tab.id, el);
                else buttons.current.delete(tab.id);
              }}
              type="button"
              role="tab"
              id={`home-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`home-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={`home-tab ${selected ? 'is-active' : ''}`}
              onClick={() => onSelect(tab.id)}
            >
              <span className="home-tab-icon" aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count && <span className="home-tab-count">{tab.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
