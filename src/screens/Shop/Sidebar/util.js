export const transformVariants = arr =>
  arr.map(({ category, props }) => {
    const obj = Object.keys(props).reduce((categoryName, propName) => {
      categoryName[propName] = [];
      return categoryName;
    }, {});

    return {
      key: category,
      value: obj,
    };
  });

export const getFiltersFormFormat = arr =>
  arr.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
