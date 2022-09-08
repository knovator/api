import { useEffect, useState } from 'react';
import commonApi from '../../api';

const useAlbum = () => {
  const [list, setList] = useState<Album[]>([]);
  const [data, setData] = useState<Album>();
  const [loading, setLoading] = useState(false);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await commonApi({ action: 'GET_ALBUMS' });
      setList(response as any);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onFormSubmit = async (formData: any) => {
    try {
      setLoading(true);
      if (data) {
        await commonApi({
          action: 'EDIT_ALBUM',
          data: formData,
          parameters: [data.id],
        });
        setList((list) =>
          list.map((item) => {
            return item.id === data.id
              ? {
                  ...item,
                  ...formData,
                }
              : item;
          })
        );
      } else {
        await commonApi({ action: 'CREATE_ALBUM', data: formData });
        setList((list) => {
          list.unshift({ title: formData.title, id: Math.random() });
          return list;
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return { list, loading, onFormSubmit, data, setData };
};

export default useAlbum;
