import AddProductButton from "@/components/dashboard/AddProductButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await getServerSession(authOptions);
    if (session?.user.email != 'ahmedayman9113@gmail.com') {
        redirect('/')
    }
    return (
        <div className="pt-24">
            <AddProductButton />
        </div>)

}
