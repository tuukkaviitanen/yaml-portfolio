import { SecondaryTitle, Text } from "./Typography";

type ProfileProps = {
  image_url?: string;
  name?: string;
  description?: string;
};

export default function Profile({
  image_url,
  name,
  description,
}: ProfileProps) {
  return (
    <div className="profile bg-white shadow-md rounded-lg p-6 mb-8 dark:bg-gray-700 dark:shadow-lg text-center">
      {image_url && (
        <div className="flex justify-center mb-4">
          <img
            src={image_url}
            height={200}
            width={200}
            className="rounded-full"
          />
        </div>
      )}
      <SecondaryTitle>About Me</SecondaryTitle>
      <div className="text-xl text-gray-600 dark:text-gray-300 pb-2">
        {name}
      </div>
      <Text>{description}</Text>
    </div>
  );
}
