import { useCallback } from "react";

interface WithId {
  id: string;
}

export function useToggleTableList<T extends WithId>(
  {
    selected,
    setSelected,
  }: {
    selected: T[];
    setSelected: (value: T[] | ((prev: T[]) => T[])) => void;
  }
) {
  const toggle = useCallback(
    (item: T) => {
      const exists = selected.some((i) => i.id === item.id);

      if (exists) {
        setSelected(selected.filter((i) => i.id !== item.id));
      } else {
        setSelected([...selected, item]);
      }
    },
    [selected, setSelected]
  );

  const isSelected = useCallback(
    (id: string) => selected.some((i) => i.id === id),
    [selected]
  );

  const clear = useCallback(() => {
    setSelected([]);
  }, [setSelected]);

  return {
    selected,
    toggle,
    isSelected,
    clear,
  };
}
