import {NextPage} from 'next';

export const Error404: NextPage = () => {
  return (
    <div className='flex grid mt-4'>
      <div className='flex flex-row h-12 col-span-4'>
        <h2 className={'px-8'}>404 - Page Not Found</h2>
      </div>
    </div>
  );
};

export default Error404;
