type ObjectType = { [key: string]: string };

type URL_PARAMS = { id?: string | number };

interface iCommonAPI {
  parameters?: string[] | number[];
  action: ACTION_TYPES;
  data?: any;
  config?: any;
}

type ACTION_TYPES =
  | 'GET_ALBUMS'
  | 'CREATE_ALBUM'
  | 'EDIT_ALBUM'
  | 'DELETE'
  | 'GET_SINGLE';

type Album = {
  userId?: number;
  id: number;
  title: string;
};
