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
    <div className="profile bg-white shadow-md hover:shadow-2xl rounded-lg p-6 mb-8 dark:bg-secondary text-center transition-all duration-300 ease-in-out">
      {image_url && (
        <div className="flex justify-center mb-4">
          <img
            alt={`Profile image for ${name}`}
            src={image_url}
            height={200}
            width={200}
            className="rounded-full shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out"
          />
        </div>
      )}
      <SecondaryTitle>About Me</SecondaryTitle>
      <div className="text-xl text-primary/90 dark:text-gray-300 pb-2">
        {name}
      </div>
      <Text>{description}</Text>
    </div>
  );
}
