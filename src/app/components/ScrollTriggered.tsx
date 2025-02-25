import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import { useRouter } from "next/navigation";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PrintIcon from '@mui/icons-material/Print';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { JSX } from "react";

const items = [
  {
    icon: <PrintIcon fontSize="large" />, 
    title: "PM Check List",
    desc: "จัดการและตรวจสอบ PM Check List ของคุณได้ที่นี่",
    colorA: 172,
    colorB: 197,
    link: "/pm",
  },
  {
    icon: <PrecisionManufacturingIcon fontSize="large" />, 
    title: "Machine Overview",
    desc: "ดูรายละเอียดของเครื่องจักรทั้งหมดในระบบ",
    colorA: 328,
    colorB: 335,
    link: "/machine",
  },
  {
    icon: <EngineeringIcon fontSize="large" />, 
    title: "PALLET ID",
    desc: "ตรวจสอบสถานะการทำงานตาม Pallet",
    colorA: 59,
    colorB: 40,
    link: "/workByPallet",
  },
];

  
export default function ScrollTriggered() {
    return (
        <div style={container}>
            {items.map(({ icon, title, desc, colorA, colorB, link }, i) => (
                <Card i={i} icon={icon} title={title} desc={desc} hueA={colorA} hueB={colorB} link={link} key={i} />
            ))}
        </div>
    );
}

interface CardProps {
    icon: JSX.Element;
    title: string;
    desc: string;
    hueA: number;
    hueB: number;
    i: number;
    link: string;
}

function Card({ icon, title, desc, hueA, hueB, i, link }: CardProps) {
    const router = useRouter();
    const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;

    return (
        <motion.div
            className={`card-container-${i}`}
            style={cardContainer}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ amount: 0.8 }}
            onClick={() => router.push(link)}
        >
            <div style={{ ...splash, background }} />
            <motion.div style={card} variants={cardVariants} className="card">
                {icon}
                <h3 style={titleStyle}>{title}</h3>
                <p style={descStyle}>{desc}</p>
            </motion.div>
        </motion.div>
    );
}

const cardVariants: Variants = {
    offscreen: {
        y: 300,
    },
    onscreen: {
        y: 50,
        rotate: -10,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
        },
    },
};

const hue = (h: number) => `hsl(${h}, 100%, 50%)`;

const container: React.CSSProperties = {
    margin: "100px auto",
    maxWidth: 500,
    paddingBottom: 100,
    width: "100%",
};

const cardContainer: React.CSSProperties = {
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 20,
    marginBottom: -120,
    cursor: "pointer",
};

const splash: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    clipPath: "path('M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z')",
};

const card: React.CSSProperties = {
    fontSize: 20,
    color: "black",
    width: 300,
    height: 430,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    background: "#f5f5f5",
    boxShadow:
        "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
    transformOrigin: "10% 60%",
    textAlign: "center",
};

const titleStyle: React.CSSProperties = {
    fontSize: "1.5em",
    fontWeight: "bold",
    margin: "10px 0",
};

const descStyle: React.CSSProperties = {
    fontSize: "1em",
    color: "#555",
    margin: "0 20px",
};




