import { useState } from 'react';

export default function useForm(initial = {}) {
  const [inputs, updateInputs] = useState(initial);

  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    updateInputs({
      ...inputs,
      [name]: value,
    });
    console.log(inputs);
  }

  function resetForm() {
    updateInputs(initial);
  }

  return {
    inputs,
    handleChange,
    resetForm,
  };
}
