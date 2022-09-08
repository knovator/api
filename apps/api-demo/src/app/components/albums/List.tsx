interface ListProps {
  list: Album[];
  loading?: boolean;
  onClickItem: (data: Album) => void;
}
const List = ({ list, loading, onClickItem }: ListProps) => {
  return (
    <>
      <h1>Albums</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {list.map((item) => (
            <li key={item.id}>
              {item.title}{' '}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" onClick={() => onClickItem(item)}>
                EDIT
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default List;
