
import { useUsers } from "@/lib/server"; // your custom hook

export default async function ListView() {
  const { data: users, error, isLoading } = await useUsers();
console.log(users, 'respns')
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Photo</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Name
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <Row key={user.id} item={user} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index }) {
  const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim();
  const email = item.email_addresses?.[0]?.email_address || "—";
  const image = item.image_url;

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          <img
            src={image}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">{fullName || "Unnamed"}</td>
      <td className="border-y bg-white px-3 py-2">{email}</td>
    </tr>
  );
}
