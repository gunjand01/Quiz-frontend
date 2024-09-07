import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import Form from '../form';
import styles from './register.module.css';
import FormInput from '../../../components/FormInput';

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const schema = yup
  .object({
    name: yup.string('Name is required').required(),
    email: yup
      .string()
      .required('Email is required')
      .matches(emailRegex, { message: 'Email is not valid' }),
    password: yup.string().required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })
  .required();

const defaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [isSafeToReset, setIsSafeToReset] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errJson = await res.json();
        console.log(errJson);
        const { errors } = errJson;

        for (const property in errors) {
          setError(property, { type: 'custom', message: errors[property] });
        }

        throw new Error(errJson.message);
      }

      toast.success('Successfully registered!');
      setIsSafeToReset(true);
      navigate('/admin');
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!isSafeToReset) return;

    reset(defaultValues); 
  }, [reset, isSafeToReset]);

  return (
    <Form title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput
          error={errors.name}
          label="name"
          register={register}
          placeholder={'Name'}
        />
        <FormInput
          error={errors.email}
          label="email"
          placeholder={'Email'}
          register={register}
        />
        <FormInput
          error={errors.password}
          label={'password'}
          register={register}
          type="password"
          placeholder={'Password'}
        />
        <FormInput
          error={errors.confirmPassword}
          label={'confirmPassword'}
          register={register}
          type="password"
          placeholder={'Confirm Password'}
        />

        <Button className={styles.submitButton}>{isSubmitting ? 'Registering...' : 'Sign-Up'}</Button>
      </form>
    </Form>
  );
}