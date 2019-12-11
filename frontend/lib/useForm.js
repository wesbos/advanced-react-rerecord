import { useState } from 'react';

export default function useForm(initial = {}) {
  const [inputs, updateInputs] = useState(initial);

  function handleChange(e) {
    updateInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    // oh - just use the default state passed in
    updateInputs(initial);
  }

  return {
    inputs,
    handleChange,
    resetForm,
  };
}
