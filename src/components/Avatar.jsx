import userPhoto from '../assets/user.jpg'

export default function Avatar({ src, alt, size = "md" }) {
    return <img className={`rounded-full mr-3 ${size == "sm" ? "size-8 mt-2" : "size-10"}`} src={src}
        onError={(e) => e.target.src = userPhoto}
        alt={alt} />
}
