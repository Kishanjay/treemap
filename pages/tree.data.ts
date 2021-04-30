import { TreeData } from '../lib/tree'

export const TREE_DATA: TreeData<{ name: string }> = {
    data: {
      name: 'Jay',
    },
    children: [
      {
        data: {
          name: 'Mitchell',
        },
        children: [
          {
            data: {
              name: 'Liley',
            },
          },
          {
            data: {
              name: '..?',
            },
          },
        ],
      },
      {
        data: {
          name: 'Claire',
        },
        children: [
          {
            data: {
              name: 'Haley',
            },
          },
          {
            data: {
              name: 'Alex',
            },
          },
          {
            data: {
              name: 'Luke',
            },
          },
        ],
      },
      {
        data: {
          name: 'Monica',
        },
        children: [
          {
            data: {
              name: 'Phoebe',
            },
            children: [
              {
                data: {
                  name: 'Triplet1',
                },
              },
              {
                data: {
                  name: 'Triplet2',
                },
              },
              {
                data: {
                  name: 'Triplet3',
                },
              },
            ],
          },
          {
            data: {
              name: 'Joey',
            },
          },
          {
            data: {
              name: 'Chandler',
            },
          },
          {
            data: {
              name: 'Ross',
            },
          },
        ],
      },
      {
        data: {
          name: 'Mitchell',
        },
        children: [
          {
            data: {
              name: 'Lily',
            },
          },
          {
            data: {
              name: '..?',
            },
          },
        ],
      },
      {
        data: {
          name: 'Mitchell',
        },
        children: [
          {
            data: {
              name: 'Lily',
            },
          },
          {
            data: {
              name: '..?',
            },
          },
        ],
      },
    ],
  };