import { ComponentProps, useState } from 'react';
import { CgCloseO } from 'react-icons/cg';
import { FaRegEyeSlash } from 'react-icons/fa6';

type Props = ComponentProps<'input'> & {
  setter: React.Dispatch<React.SetStateAction<string>>;
  blind?: boolean;
};

const LoginInput = ({
  setter,
  blind = false,
  className = '',
  value,
  ...rest
}: Props) => {
  const [isBlind, setBlind] = useState(blind);
  return (
    <div
      className={`border rounded-md px-3 py-2 focus:outline-none focus:border-green-500 flex justify-between items-center ${className}`}
    >
      <input {...rest} value={value} type={isBlind ? 'password' : 'none'} />
      <div className="flex items-center justify-end w-2/12">
        {blind && (
          <FaRegEyeSlash
            style={{ marginRight: '0.5rem' }}
            onClick={() => setBlind(!isBlind)}
          />
        )}
        {value && (
          <CgCloseO
            onClick={() => {
              setter('');
            }}
          />
        )}
      </div>
    </div>
  );
};

export { LoginInput };
