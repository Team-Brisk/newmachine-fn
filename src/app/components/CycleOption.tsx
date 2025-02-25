import * as motion from "motion/react-client"

export default function Rotate() {
    return (
        <motion.div
            animate={{
                rotate: 360, 
                scale: [1, 1.2, 1], 
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
            }}
            transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
            }}
            style={box}
        />
    )
}

/**
 * ==============   Styles   ================
 */

const box = {
    width: 350,
    height: 350,
    // borderRadius: "50%",
    background: "linear-gradient(121deg, rgb(255, 126, 50) 11%, rgb(255, 162, 132) 40%, rgb(255, 157, 219) 91%)",
    boxShadow: "rgba(255, 0, 0, 0.3) 0px 0px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
}