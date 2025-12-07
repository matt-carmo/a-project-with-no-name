let ids: string[] = [];

export function useIds() {

  function setIds(newIds: string[]) {
    ids = newIds;
  }

  function addId(id: string) {
    ids.push(id);
  }

  function getIds() {
    return ids;
  }

  return { setIds, addId, getIds };
}