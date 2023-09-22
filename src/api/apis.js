const inspections = new Map(
  Object.entries({
    1: {
      id: 1,
      type: 'Photo',
      date: '2022-12-01T00:00:00.000Z',
      inspector: 'Tom',
      status: 'Draft',
      observations: 'This is photo inspection by Tom',
      tags: ['Tom', 'Photo'],
    },
    2: {
      id: 2,
      type: 'Hydro',
      date: '2022-11-01T00:00:00.000Z',
      inspector: 'Jerry',
      status: 'WIP',
      observations: 'This is hydro inspection by Jerry',
      recommendation: 'Ground Inspection',
      interimAction: 'Monitoring',
      tags: ['Jerry', 'Hydro'],
    },
    3: {
      id: 3,
      type: 'Geo',
      date: '2022-10-01T00:00:00.000Z',
      inspector: 'Tom',
      status: 'Final',
      observations: 'This is geo inspection by Tom',
      exposures: false,
      spanning: true,
      tags: ['Tom', 'geo'],
    },
    4: {
      id: 4,
      type: 'Hydro',
      date: '2022-09-01T00:00:00.000Z',
      inspector: 'Tom',
      status: 'Final',
      observations: 'This is hydro inspection by Tom',
      recommendation: 'Photo Inspection',
      interimAction: 'Monitoring',
      tags: ['Tom', 'hydro'],
    },
    5: {
      id: 5,
      type: 'Hydro',
      date: '2022-08-01T00:00:00.000Z',
      inspector: 'Jerry',
      status: 'WIP',
      observations: 'This is hydro inspection by Jerry',
      tags: ['Jerry', 'Hydro'],
    },
    6: {
      id: 6,
      type: 'Geo',
      date: '2022-07-01T00:00:00.000Z',
      inspector: 'Jerry',
      status: 'Final',
      observations: 'This is geo inspection by Jerry',
      exposures: true,
      spanning: false,
      tags: ['Jerry', 'Geo'],
    },
    7: {
      id: 7,
      type: 'Photo',
      date: '2022-06-01T00:00:00.000Z',
      inspector: 'Tom',
      status: 'Draft',
      observations: 'This is photo inspection by Tom',
      tags: ['Tom', 'Photo'],
    },
  })
);

/*
Get Inspections API
1. Get inspection by given inspectionId, throw error if not found.
2. Get all inspections if inspectionId is omitted. 
*/
export const getInspections = (inspectionId) => {
  if (inspectionId != null) {
    const key = inspectionId.toString();
    return inspections.has(key)
      ? Promise.resolve(inspections.get(key))
      : Promise.reject('inspection not found');
  } else {
    const inspectionArray = [...inspections.values()];
    // shuffle
    for (let i = inspectionArray.length - 1; i > 0; i--) {
      let randomSlotIndex = Math.floor(Math.random() * (i + 1));
      // swap
      [inspectionArray[i], inspectionArray[randomSlotIndex]] = [
        inspectionArray[randomSlotIndex],
        inspectionArray[i],
      ];
    }
    return Promise.resolve(inspectionArray);
  }
};

/*
Get Inspection Images API
1. Get inspection images by given inspectionId, throw error if not found.
2. Get all inspection images if inspectionId is omitted.
*/
const generateDummyImages = (inspectionId) => {
  return [1, 2, 3].map(
    (num) =>
      new URL(
        `https://dummyimage.com/150x150/696969/ffffff&text=${inspectionId}-${num}`
      )
  );
};

export const getImages = (inspectionId) => {
  if (inspectionId != null) {
    const key = inspectionId.toString();
    return inspections.has(key)
      ? Promise.resolve(generateDummyImages(inspectionId))
      : Promise.reject('inspection not found');
  } else {
    return Promise.resolve(
      [...inspections.values()].map((inspection) =>
        generateDummyImages(inspection.id)
      )
    );
  }
};
