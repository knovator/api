import { Form, List } from './components/albums';
import useAlbum from './hooks/useAlbum';

export function App() {
  const { list, loading, onFormSubmit, data, setData } = useAlbum();
  return (
    <>
      <Form onSubmit={onFormSubmit} data={data} loading={loading} />
      <List list={list} loading={loading} onClickItem={setData} />
    </>
  );
}

export default App;
