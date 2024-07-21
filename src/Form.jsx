import React, { useState, useEffect } from 'react';
import './Form.css';
import { useForm } from "react-hook-form";
import axios from 'axios';

const Form = () => {
  const texts = ["Hello! Welcome Please Enter Your Details"];
  const texts2 = ["Thanks! Your Details Has Been Recorded"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [flag, setFlag] = useState(false)
  const [reverse, setReverse] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    number: '',
    country: '',
    city: ''
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const delay = (d) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const onSubmit = async (data) => {
    await delay(3);
    if (step < 5) {
      setFormData((prevData) => ({ ...prevData, ...data }));
      setStep(step + 1);
      setValue(Object.keys(data)[0], ""); // Clear the input field
    } else {
      const finalFormData = { ...formData, ...data };
      
      // Function to remove properties with undefined values
      const removeUndefined = (obj) => {
        return Object.fromEntries(Object.entries(obj).filter(([k, v]) => k !== undefined));
      };
      
      const cleanedFormData = removeUndefined(finalFormData);
      setFormData(cleanedFormData);
      setFlag(true);
      setStep(step + 1);

      // Send the data to the backend
      try {
        const response = await axios.post('https://backend-1s67.onrender.com/api/form/submit', cleanedFormData);
        console.log(response.data);
      } catch (error) {
        console.error('Error submitting form data', error);
      }
    }
  };

  // Typewriter effect
  useEffect(() => {
    setFormData({
      email: '',
      name: '',
      number: '',
      country: '',
      city: ''
    });
    setTimeout(() => {
      setHidden(false);
    }, 10000);
    if (index === texts.length) return;

    if (subIndex === texts[index].length + 1 && !reverse) {
      setReverse(true);
      setTimeout(() => setReverse(false), 1000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => prev + 1);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === texts[index].length ? 1000 : 150, parseInt(Math.random() * 350)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  // Blinking cursor
  useEffect(() => {
    const blinkTimeout = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(blinkTimeout);
  }, [blink]);

  return (
    <div className="typing-container">
      <form onSubmit={handleSubmit(onSubmit)} className={`nest ${hidden ? 'hidden' : ''}`}>
        {step === 0 && (
          <>
            <span>{`${texts[index].substring(0, subIndex)}`}</span>
          </>
        )}
        {step === 1 && (
          <>
            <span>{`${texts[index].substring(0, subIndex)}`}</span>

            <label className='input-label' htmlFor="email">Email:</label>
            <input
              placeholder="Email"
              {...register("email", {
                required: { value: true, message: "This field is required" },
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                minLength: { value: 3, message: "Enter a minimum of 3 characters" },
                maxLength: { value: 30, message: "Max characters exceeded" }
              })}
              type="email"
              name="email"
              id="email"
            />
          </>
        )}
        {step === 2 && (
          <>
            <label className='input-label' htmlFor="name">Enter Your Name :</label>
            <input
              placeholder="Name"
              {...register("name", {
                required: { value: true, message: "This field is required" },
                minLength: { value: 3, message: "Enter a minimum of 3 characters" },
                maxLength: { value: 30, message: "Max characters exceeded" }
              })}
              type="text"
              name="name"
              id="name"
            />
          </>
        )}
        {step === 3 && (
          <>
            <label className='input-label' htmlFor="number">Enter Your Number :</label>
            <input
              placeholder="Number"
              {...register("number", {
                required: { value: true, message: "This field is required" },
                pattern: { value: /^\d+$/, message: 'Invalid number' },
                minLength: { value: 10, message: "Enter a minimum of 10 digits" },
                maxLength: { value: 15, message: "Max digits exceeded" }
              })}
              type="text"
              name="number"
              id="number"
            />
          </>
        )}
        {step === 4 && (
          <>
            <label className='input-label' htmlFor="country">Enter Your Country :</label>
            <input
              placeholder="Country"
              {...register("country", {
                required: { value: true, message: "This field is required" },
                minLength: { value: 3, message: "Enter a minimum of 3 characters" },
                maxLength: { value: 30, message: "Max characters exceeded" }
              })}
              type="text"
              name="country"
              id="country"
            />
          </>
        )}
        {step === 5 && (
          <>
            <label className='input-label' htmlFor="city">Enter Your City :</label>
            <input
              placeholder="City"
              {...register("city", {
                required: { value: true, message: "This field is required" },
                minLength: { value: 3, message: "Enter a minimum of 3 characters" },
                maxLength: { value: 30, message: "Max characters exceeded" }
              })}
              type="text"
              name="city"
              id="city"
            />
          </>
        )}
        {flag && <span>{`${texts2[index].substring(0, subIndex)}`}</span>}

        {!flag && <input type="submit" className='styled-button' value={step < 4 ? "Continue" : "Submit"} />}
      </form>
      {errors.email && <p className="error-message">{errors.email.message}</p>}
      {errors.name && <p className="error-message">{errors.name.message}</p>}
      {errors.number && <p className="error-message">{errors.number.message}</p>}
      {errors.country && <p className="error-message">{errors.country.message}</p>}
      {errors.city && <p className="error-message">{errors.city.message}</p>}
    </div>
  );
};

export default Form;
