import React from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { RiCloseLine } from "react-icons/ri"
import { useSelector } from "react-redux";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
`;
const ModalContainer = styled(motion.div)`
  width: 90%;
  max-width: 650px;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`;

const modalVariant = {
  initial: { opacity: 0 },
  isOpen: { opacity: 1 },
  exit: { opacity: 0 }
};
const containerVariant = {
  initial: { top: "-50%", transition: { type: "spring" } },
  isOpen: { top: "50%" },
  exit: { top: "-50%" }
};
const Modal = ({ handleClose, children, isOpen }) => {
  const {theme} = useSelector(state=>state.theme)
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={"initial"}
          animate={"isOpen"}
          exit={"exit"}
          variants={modalVariant}
        >
          <ModalContainer variants={containerVariant} className={`${theme==='light'?'bg-[#FBFCF8]':'bg-[rgb(14,22,45)]'}`} >
            <div className="w-full flex items-center justify-end">
              <RiCloseLine onClick={handleClose} size={30} className="border border-yellow-300 active:border-red-700 bg-[#eaeaea6f] rounded-full p-[2px] transition duration-300 ease-in-out cursor-pointer" />
            </div>
            {children}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
