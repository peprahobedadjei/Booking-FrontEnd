import Image from 'next/image';
import Link from 'next/link';

const EventBanner = () => {
  return (
    <div className='relative flex h-screen flex-col justify-between overflow-hidden text-white bg-brandPrimary'>
      <div className='container mx-auto flex flex-col items-center px-4 py-12 md:flex-row'>
        <div className='flex-1'>
          <h1 className='mb-4 text-4xl font-bold md:text-6xl'>
            Join the <span className='text-yellow-400'>Grad-Dinner</span> of the
            year
          </h1>
          <p className='mb-6 text-lg md:text-xl'>
            Experience lightning talks, meeting of new people, and savor
            delectable food and drinks. An evening crafted for everyone awaits.
          </p>
          <Link
            href='/buy-ticket'
            className='rounded-lg bg-pink-500 px-6 py-2 text-lg font-semibold text-white transition duration-300 hover:bg-pink-600'
          >
            Book a Seat
          </Link>
        </div>
        <div className='mt-8 flex h-96 w-96 flex-1 justify-center md:mt-0'>
          <div className='relative h-96 w-96 md:h-80 md:w-80'>
            <Image
              src='illust.png' // Replace with the actual image path
              alt='Event Illustration'
              layout='fill'
              objectFit='cover'
            />
          </div>
        </div>
      </div>
      <div className='absolute bottom-0 w-full bg-blue-700 py-4 text-center'>
        <p className='text-lg font-semibold md:text-xl'>
          Sat. June 1st, 2024 | Pantaloon Building, KIIT Road | 4PM till
          midnight
        </p>
      </div>
    </div>
  );
};

export default EventBanner;