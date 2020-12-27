import mitt from 'mitt';

const emitter = mitt();

const Cmd = {
  openModal: (modalProps: ModalPropsType) => {
    emitter.emit('modal:open', modalProps);
  },

  on: (type: string, handler: (...args: any[]) => void) => {
    emitter.on(type, handler);
  },
  off: (type: string, handler: (...args: any[]) => void) => {
    emitter.off(type, handler);
  },
};

export default Cmd;
