import React, { useEffect, useState } from 'react';
import { IconButton, SlideFade } from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa';
import { ChevronUpIcon } from '@chakra-ui/icons';

const GlobalFloatButtons = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp Floating Button (bottom left) */}
      <IconButton
        as="a"
        href="https://wa.me/919871785859"
        target="_blank"
        aria-label="WhatsApp Chat"
        icon={<FaWhatsapp size={24} />}
        bg="green.400"
        color="white"
        borderRadius="full"
        boxSize={12}
        position="fixed"
        left={6}
        bottom={6}
        zIndex={100}
        boxShadow="lg"
        _hover={{ bg: 'green.500' }}
      />
      {/* Back to Top Floating Button (bottom right) */}
      <SlideFade in={showTop} offsetY={20} style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 100 }}>
        <IconButton
          aria-label="Back to Top"
          icon={<ChevronUpIcon boxSize={7} />}
          bg="purple.500"
          color="white"
          borderRadius="full"
          boxSize={12}
          boxShadow="lg"
          _hover={{ bg: 'purple.600' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </SlideFade>
    </>
  );
};

export default GlobalFloatButtons;
