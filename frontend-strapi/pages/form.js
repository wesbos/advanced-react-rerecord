import useForm from '../lib/useForm';

function Form() {
  const { inputs, handleChange, resetForm } = useForm({ name: '', age: '' });
  return (
    <div>
      <pre>{JSON.stringify(inputs)}</pre>
      <button onClick={resetForm}>Reset</button>
      <form
        onSubmit={e => {
          e.preventDefault();
          console.log(inputs);
        }}
      >
        <label htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={inputs.name}
          />
        </label>

        <label htmlFor="age">
          Age:
          <input
            type="text"
            name="age"
            onChange={handleChange}
            value={inputs.age}
          />
        </label>
      </form>
    </div>
  );
}

export default Form;
