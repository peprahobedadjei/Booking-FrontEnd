// pages/form.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';

const FormPage = () => {
  const [ticketType, setTicketType] = useState<string>('Lonely at the top');
  const [amount, setAmount] = useState<number>(50);
  const [numPersons, setNumPersons] = useState<number>(1);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [transactionImage, setTransactionImage] = useState<File | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [personDetails, setPersonDetails] = useState<
    { name: string; email: string; phone: string }[]
  >([]);
  const [ticketNumber, setTicketNumber] = useState<string>('');

  useEffect(() => {
    setTicketNumber(generateTicketNumber());
  }, []);

  const generateTicketNumber = (): string => {
    const randomNumber = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `GRADPARTY-${randomNumber}/24`;
  };

  const handleTicketTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setTicketType(selectedType);
    setAmount(selectedType === 'Lonely at the top' ? 50 : 80);
  };

  const handleNumPersonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumPersons = parseInt(e.target.value, 10);
    setNumPersons(newNumPersons);
    setPersonDetails(
      Array(newNumPersons).fill({ name: '', email: '', phone: '' })
    );
  };

  const handlePersonDetailsChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newPersonDetails = [...personDetails];
    newPersonDetails[index] = { ...newPersonDetails[index], [field]: value };
    setPersonDetails(newPersonDetails);
  };

  const handleTransactionImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setTransactionImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('ticketNumber', ticketNumber);
    formData.append('ticketType', ticketType);
    formData.append('amount', amount.toString());
    formData.append('total', totalAmount.toString());
    formData.append('transactionScreenshot', transactionImage);
    formData.append('personDetails', JSON.stringify(personDetails)); // Ensure this is a JSON string

    try {
      const response = await fetch('https://booking-back-end.vercel.app/submit/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log(response);
        setFormSubmitted(true);
      } else {
        const errorText = await response.text();
        setErrors([`Failed to submit data: ${errorText}`]);
      }
    } catch (error) {
      setErrors([`Failed to submit data: ${error.message}`]);
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    personDetails.forEach((person, index) => {
      if (!person.name) errors.push(`Name of Person ${index + 1} is required.`);
      if (!person.email)
        errors.push(`Email Address of Person ${index + 1} is required.`);
      if (
        person.email &&
        !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(person.email)
      ) {
        errors.push(`Email Address of Person ${index + 1} is invalid.`);
      }
      if (!person.phone)
        errors.push(`Phone Number of Person ${index + 1} is required.`);
      if (
        person.phone &&
        !/^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/.test(person.phone)
      ) {
        errors.push(`Phone Number of Person ${index + 1} is invalid.`);
      }
    });
    if (!transactionImage) {
      errors.push('Transaction screenshot is required.');
    }
    return errors;
  };

  const totalAmount = amount * numPersons;

  return (
    <div className='min-h-screen bg-white p-8 text-black'>
      {formSubmitted && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='rounded-lg bg-white p-6 text-center shadow-lg'>
            <h2 className='mb-4 text-2xl font-bold'>
              You just joined the Dinner List
            </h2>
            <p>Congratulations. See you there!</p>
            <button
              className='mt-4 rounded-lg bg-pink-500 px-4 py-2 text-white'
              onClick={() => setFormSubmitted(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h1 className='mb-8 text-center text-3xl font-bold'>Buy Ticket</h1>
      <div>
        <div className='mb-8 flex h-14 justify-center space-x-4'>
          <div className='w-52 rounded-sm bg-pink-500 px-2'>
            <h2 className='text-base font-semibold text-white'>
              Lonely at the top
            </h2>
            <p className='text-base text-white'>₹50</p>
          </div>
          <div className='w-40 rounded-sm bg-pink-500 px-2'>
            <h2 className='text-base font-semibold text-white '>
              Bestie and I
            </h2>
            <p className='text-base text-white'>₹80</p>
          </div>
        </div>
        <form className='mx-auto max-w-lg space-y-4' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Ticket Number
            </label>
            <input
              type='text'
              value={ticketNumber}
              readOnly
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Ticket Type
            </label>
            <select
              value={ticketType}
              onChange={handleTicketTypeChange}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
            >
              <option>Lonely at the top</option>
              <option>Bestie and I</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Amount
            </label>
            <input
              type='text'
              value={`₹${amount}`}
              readOnly
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Number of Persons
            </label>
            <input
              type='number'
              min='1'
              value={numPersons}
              onChange={handleNumPersonsChange}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
            />
          </div>
          {Array.from({ length: numPersons }).map((_, index) => (
            <div key={index} className='space-y-2'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Name of Person {index + 1}
                </label>
                <input
                  type='text'
                  value={personDetails[index]?.name || ''}
                  onChange={(e) =>
                    handlePersonDetailsChange(index, 'name', e.target.value)
                  }
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Email Address of Person {index + 1}
                </label>
                <input
                  type='email'
                  value={personDetails[index]?.email || ''}
                  onChange={(e) =>
                    handlePersonDetailsChange(index, 'email', e.target.value)
                  }
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Phone Number of Person {index + 1}
                </label>
                <input
                  type='tel'
                  value={personDetails[index]?.phone || ''}
                  onChange={(e) =>
                    handlePersonDetailsChange(index, 'phone', e.target.value)
                  }
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
                />
              </div>
            </div>
          ))}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Total Amount
            </label>
            <input
              type='text'
              value={`₹${totalAmount}`}
              readOnly
              className='mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
            />
          </div>
          <div>
            <button
              type='button'
              className='mt-4 w-full rounded-lg bg-pink-500 px-4 py-2 text-white shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50'
              onClick={() => setShowQrCode(!showQrCode)}
            >
              View QR Code
            </button>
            {showQrCode && (
              <div className='mt-4 rounded-lg border border-gray-300 p-4 text-center'>
                <p>Scan To make Payment</p>
                <p className='mt-3 font-bold'>
                  Account Name: Mr. Dominic Asamoah Ampofo
                </p>
                <Image
                  src='/qr.png' // Replace with your QR code image path
                  alt='QR Code'
                  className='mx-auto mt-2'
                  width={250}
                  height={250}
                />
              </div>
            )}
          </div>
          <div className='mt-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Upload Transaction Screenshot
            </label>
            <input
              type='file'
              accept='image/png, image/jpeg, image/jpg'
              onChange={handleTransactionImageChange}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm'
            />
          </div>
          {errors.length > 0 && (
            <div className='text-sm text-red-500'>
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <button
            type='submit'
            className='mt-4 w-full rounded-lg bg-pink-500 px-4 py-2 text-white shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
