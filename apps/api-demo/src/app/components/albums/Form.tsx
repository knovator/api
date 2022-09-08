import { FormEvent, useEffect, useState } from 'react';

interface FormProps {
  onSubmit: (data: any) => void;
  data: any;
  loading?: boolean;
}
const Form = ({ onSubmit, data, loading }: FormProps) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (data) {
      setTitle(data.title);
    }
  }, [data]);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ title });
    setTitle('');
  };

  const onReset = () => {
    setTitle('');
  };

  return (
    <>
      <h1>Album Form</h1>
      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          value={title}
          disabled={loading}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="reset" disabled={loading} onClick={onReset}>
          Reset
        </button>
        <button type="submit" disabled={loading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default Form;
