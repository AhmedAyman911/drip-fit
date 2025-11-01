import Link from "next/link"
import Image from "next/image"


export default function ItemCard() {
    return (
        <Link href={'/item'} className="flex flex-col w-80">
            <Image alt="item img"
                src={'/test.jpg'}
                width={512}
                height={512}
                className="object-cover"
            />
            <div className="p-3">
                <p className="text-sm text-gray-400 dark:text-gray-500">category</p>
                <p className="text-lg md:text-2xl font-bold">title</p>
                <div className="flex">
                    <span className="text-md font-bold">123</span>
                    <span className="text-md font-bold text-green-400">&nbsp;$</span>
                </div>
            </div>
        </Link>
    )
}