function parseMultipartObject(body: any) {
  const result: any = {};
  
  for (const key in body) {
    const value = body[key];

    if (!key.includes("["))
      return result[key] = value;


    const parts = key.split(/\[|\]/).filter(Boolean); 

    let cur = result;

    parts.forEach((p, i) => {
      const isLast = i === parts.length - 1;

      if (!isLast) {
        if (!cur[p]) {
          cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
        }
        cur = cur[p];
      } else {
        cur[p] = value;
      }
    });
  }

  return result;
}
