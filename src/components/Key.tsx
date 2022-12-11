import { motion } from 'framer-motion'

const Key: React.FC<{ value: string | undefined, status?: string | undefined, reveal?: boolean }> = ({ value, status, reveal }) => {
    let style: string = "bg-gray-500";


    switch(status) {
        case "correct":
            style = "bg-green-500"
            break;
        case "present":
            style = "bg-yellow-500"
            break;
        case "incorrect":
            style = "bg-gray-500"
            break;
    }
    let animation;

    if (reveal) {
        
    }
    
    if (!value) {
        return (
            <div className="flex w-12 h-12 border-2 rounded-sm">
                {value}
            </div>
        )
    }

    return (
        <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
            duration: 0.2,
        }}
        className={"flex items-center justify-center w-12 h-12 rounded-sm font-bold text-white select-none " + style}>
            {value}
        </motion.div>
    )
}

export default Key;