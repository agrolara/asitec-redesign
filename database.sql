-- ==========================================================
-- ASITEC S.A. - BASE DE DATOS AUTOADMINISTRABLE
-- Compatible con MySQL 5.7+ / MySQL 8.x / MariaDB 10.x
-- Generado para phpMyAdmin en cPanel
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- 1. Tabla de Usuarios Administradores
-- --------------------------------------------------------
DROP TABLE IF EXISTS `user_tokens`;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuario inicial: admin / Asitec2026!Admin
INSERT INTO `users` (`id`, `username`, `password_hash`, `full_name`, `email`, `role`) VALUES
(1, 'admin', '8d07a9eadc7679bc123ca3c37c7697c4f5000ac057ac2d369942d012c11dd13a', 'Administrador Asitec', 'admin@asitec.cl', 'admin');

-- --------------------------------------------------------
-- 2. Tabla de Tokens de Sesión
-- --------------------------------------------------------
CREATE TABLE `user_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL UNIQUE,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `fk_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Tabla de Productos y Premezclas (Catálogo B2B)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `subcategory` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `format` varchar(255) DEFAULT '',
  `shelf_life` varchar(255) DEFAULT '',
  `country` varchar(100) DEFAULT 'Chile',
  `image` text DEFAULT '',
  `popular` tinyint(1) NOT NULL DEFAULT 0,
  `source_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cat_idx` (`category`),
  KEY `subcat_idx` (`subcategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `name`, `category`, `subcategory`, `description`, `format`, `shelf_life`, `country`, `image`, `popular`, `source_url`) VALUES
('pasteler-a-1', 'Crema Pastelera', 'Pastelería', 'Bases para preparar', 'Base en polvo para preparar Crema Pastelera, de excelente sabor y consistencia para la decoración y/o relleno de pasteles y masas dulces. Se puede hornear y congelar.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-01-1.png', 1, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-2', 'Crema Pastelera Especial', 'Pastelería', 'Bases para preparar', 'Base en polvo para preparar Crema Pastelera Especial, de atractivo color, sabor, dulzor y consistencia ideal para la preparación de productos de repostería. Se puede hornear y congelar. También se puede mezclar con pulpas de fruta para rellenos de repostería.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/WhatsApp-Image-2022-02-08-at-21.53.18-1.jpeg', 1, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-3', 'Crema Pastelera Neutra', 'Pastelería', 'Bases para preparar', 'Base en polvo para preparar Crema Pastelera Neutra. Se puede refrigerar, hornear y congelar.', 'Caja de 10 dosis de 1 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/crema-pastelera-neutro.jpg', 0, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-4', 'Crema Chantilly', 'Pastelería', 'Bases para preparar', 'Base en polvo para preparar crema chantilly sabor Crema, de excelente sabor, volumen, textura suave y estabilidad. Ideal para rellenar y decorar sus productos de repostería.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-1.jpg', 1, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-5', 'Crema Chantilly Lúcuma', 'Pastelería', 'Bases para preparar', 'Base en polvo para preparar crema chantilly sabor Lúcuma, de excelente sabor, volumen, textura suave y estabilidad. Ideal para rellenar y decorar sus productos de repostería.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-lúcuma-1.jpg', 0, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-6', 'Crema Chantilly Chocolate', 'Pastelería', 'Bases para preparar', 'Base en polvo para preparar crema chantilly sabor Chocolate, de excelente sabor, volumen, textura suave y estabilidad. Ideal para rellenar y decorar sus productos de repostería.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-chocolate-1.jpg', 0, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-7', 'Remojo 3 Leches', 'Pastelería', 'Bases para preparar', 'Base en polvo para remojo de torta tres leches, de fácil preparación. Entrega a su producto notas de crema, leche condensada y leche evaporada.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/remojo-3-leches.jpg', 0, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-8', 'Brillo en Polvo', 'Pastelería', 'Bases para preparar', 'Base en polvo para preparar Brillo, sólo debe agregar agua fría, hervir por unos minutos y luego aplicar directamente a sus productos, para dar un acabado profesional a Tartaletas, Medias Lunas y Masas Dulces', 'Caja de 20 dosis de 450 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/brillo.jpg', 0, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-9', 'Merengue', 'Pastelería', 'Bases para preparar', 'Base en polvo para preparar Merengue tipo Italiano de excelente volumen, consistencia y dulzor, especial para decorar pie de limón, elaborar merenguitos y postres.', 'Caja de 13 dosis de 600 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/bases-para-preparar-merengue-1.jpg', 0, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-10', 'Polvo para Hornear', 'Pastelería', 'Bases para preparar', 'Agente leudante químico de doble acción, utilizado en masas y batidos de pastelería. Este producto permite obtener resultados con mayor volumen y excelente esponjosidad.', 'caja de 20 dosis de 500 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-03-1.png', 0, 'https://www.asitec.cl/bases-para-preparar/'),
('pasteler-a-11', 'Premezcla bizcocho vainilla', 'Pastelería', 'Premezclas para bizcochos', 'Premezcla para elaborar bizcocho, brazo de reina y empolvados.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_bizcocho_vainilla.jpg', 1, 'https://www.asitec.cl/premezclas-para-bizcochos/'),
('pasteler-a-12', 'Premezcla bizcocho chocolate', 'Pastelería', 'Premezclas para bizcochos', 'Premezcla para elaborar bizcocho sabor chocolate.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_bizcocho_chocolate.jpg', 0, 'https://www.asitec.cl/premezclas-para-bizcochos/'),
('pasteler-a-13', 'Premezcla queque vainilla', 'Pastelería', 'Premezclas queques', 'Premezcla para elaborar queque sabor vainilla de miga esponjosa, suave y húmeda.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_vainilla.jpg', 1, 'https://www.asitec.cl/premezclas-queques/'),
('pasteler-a-14', 'Premezcla queque plátano', 'Pastelería', 'Premezclas queques', 'Premezcla para elaborar queque sabor plátano de miga esponjosa, suave y húmeda.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_plátano.jpg', 0, 'https://www.asitec.cl/premezclas-queques/'),
('pasteler-a-15', 'Premezcla queque naranja', 'Pastelería', 'Premezclas queques', 'Premezcla para elaborar queque sabor naranja de miga esponjosa, suave y húmeda.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_naranja.jpg', 0, 'https://www.asitec.cl/premezclas-queques/'),
('pasteler-a-16', 'Premezcla queque berries', 'Pastelería', 'Premezclas queques', 'Premezcla para elaborar queque sabor berries de miga esponjosa, suave y húmeda.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_berries.jpg', 0, 'https://www.asitec.cl/premezclas-queques/'),
('pasteler-a-17', 'Premezcla queque chocolate', 'Pastelería', 'Premezclas queques', 'Premezcla para elaborar queque chocolate de miga esponjosa, suave, húmeda y con sabor a chocolate.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_chocolate.jpg', 1, 'https://www.asitec.cl/premezclas-queques/'),
('pasteler-a-18', 'Premezcla queque de pascua con materia grasa', 'Pastelería', 'Premezclas queques de Pascua', 'Premezcla con materia grasa incorporada para elaborar queque de pascua de excelente sabor, miga compacta y húmeda. Sólo debe adicionar agua.', 'Caja de 10 dosis de 1 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_pascua_materia_grasa.jpg', 0, 'https://www.asitec.cl/premezclas-queques-de-pascua/'),
('pasteler-a-19', 'Premezcla queque de pascua sin materia grasa', 'Pastelería', 'Premezclas queques de Pascua', 'Premezcla sin materia grasa para elaborar queque de pascua de excelente sabor, miga compacta y húmeda.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_pascua_sin_materia_grasa.jpg', 0, 'https://www.asitec.cl/premezclas-queques-de-pascua/'),
('pasteler-a-20', 'Premezcla muffins vainilla', 'Pastelería', 'Premezclas muffins', 'Premezcla para elaborar muffins sabor vainilla de miga esponjosa, húmeda y excelente volumen.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_muffins_vainilla.jpg', 0, 'https://www.asitec.cl/premezclas-muffins/'),
('pasteler-a-21', 'Premezcla muffins chocolate', 'Pastelería', 'Premezclas muffins', 'Premezcla para elaborar muffins sabor chocolate de miga esponjosa, húmeda y excelente volumen.', 'Caja de 10 dosis de 1 Kg Saco 10 Kg Saco 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_muffins_chocolate.jpg', 0, 'https://www.asitec.cl/premezclas-muffins/'),
('panader-a-24', 'Premezclas para panadería Rapidox', 'Panadería', 'Premezclas Rapidox Panadería', '', '', '', 'Chile', '', 1, 'https://www.asitec.cl/premezclas-para-panaderia-rapidox/'),
('panader-a-25', 'Molde blanco', 'Panadería', 'Premezclas Rapidox Panadería', 'Premezcla con materia grasa incorporada para elaborar pan de molde blanco y pan soft, de excelente sabor, color y volumen.', 'Sacos de 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 1, 'https://www.asitec.cl/premezclas-para-panaderia-rapidox/'),
('panader-a-26', 'Molde integral', 'Panadería', 'Premezclas Rapidox Panadería', 'Premezcla con materia grasa incorporada para elaborar pan de molde integral, marraqueta, bollos y hallullas integrales, de excelente sabor, color y volumen.', 'Sacos de 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 0, 'https://www.asitec.cl/premezclas-para-panaderia-rapidox/'),
('panader-a-27', 'Amasado', 'Panadería', 'Premezclas Rapidox Panadería', 'Premezcla con materia grasa incorporada para elaborar pan amasado de excelente volumen, color, sabor y miga compacta.', 'Sacos de 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 0, 'https://www.asitec.cl/premezclas-para-panaderia-rapidox/'),
('panader-a-28', 'Dobladas y masas para dobladas', 'Panadería', 'Premezclas Rapidox Panadería', 'Premezcla con materia grasa incorporada para elaborar pan dobladas y discos de empanadas horneadas de excelente sabor, color.', 'Sacos de 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 0, 'https://www.asitec.cl/premezclas-para-panaderia-rapidox/'),
('panader-a-29', 'Pan ciabatta', 'Panadería', 'Premezclas Rapidox Panadería', 'Premezcla Sin materia grasa incorporada para elaborar pan ciabatta, pan toscano (con aceitunas), panes con alta hidratación, de excelente sabor, aroma, crocancia y miga irregular.', 'Sacos de 25 Kg', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 1, 'https://www.asitec.cl/premezclas-para-panaderia-rapidox/'),
('panader-a-30', 'Mejoradores, núcleos y bases para panadería Rapidox', 'Panadería', 'Mejoradores, núcleos y bases', '', '', '', 'Chile', '', 0, 'https://www.asitec.cl/mejoradores-nucleos-y-bases-para-panaderia-rapidox/'),
('panader-a-31', 'Mejorador marraqueta', 'Panadería', 'Mejoradores, núcleos y bases', 'Mejorador enzimático para marraquetas y panes crujientes, desarrollado para procesos de fermentación normal para amasanderías y panaderías, se obtiene un producto de excelente volumen, color y crocancia.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta.jpg', 1, 'https://www.asitec.cl/mejoradores-nucleos-y-bases-para-panaderia-rapidox/'),
('panader-a-32', 'Mejorador marraqueta especial', 'Panadería', 'Mejoradores, núcleos y bases', 'Mejorador enzimático para marraquetas, Baguettes y Panes de Campo, desarrollado para procesos de fermentación larga para panaderías industriales, se obtiene un producto de excelente volumen, color y crocancia.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta-especial.jpg', 0, 'https://www.asitec.cl/mejoradores-nucleos-y-bases-para-panaderia-rapidox/'),
('panader-a-33', 'Mejorador hallulla', 'Panadería', 'Mejoradores, núcleos y bases', 'Mejorador enzimático para hallullas, desarrollado para todo tipo de proceso de panificación, se obtiene un producto de excelente color, miga suave y corteza blanca', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-para-allulla.jpg', 0, 'https://www.asitec.cl/mejoradores-nucleos-y-bases-para-panaderia-rapidox/'),
('panader-a-34', 'Mejorador marraqueta 50% reducido en sodio', 'Panadería', 'Mejoradores, núcleos y bases', 'Mejorador enzimático 50% reducido en sodio para marraquetas y panes crujientes, desarrollado para procesos de fermentación normal para amasanderías y panaderías, se obtiene un producto de excelente volumen, color y crocancia.', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/mejorador-marraqueta-reducido-en-50-sodio.jpg', 0, 'https://www.asitec.cl/mejoradores-nucleos-y-bases-para-panaderia-rapidox/'),
('panader-a-35', 'Mejorador hallulla 50% reducido en sodio', 'Panadería', 'Mejoradores, núcleos y bases', 'Mejorador enzimático 50% reducido en sodio para hallullas, desarrollado para todo tipo de proceso de panificación, se obtiene un producto de excelente color, miga suave y corteza blanca', 'Caja de 20 dosis de 400 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2021/07/mejorador-hallulla-reducido-en-50-sodio.jpg', 0, 'https://www.asitec.cl/mejoradores-nucleos-y-bases-para-panaderia-rapidox/'),
('panader-a-36', 'Base soft al 20%', 'Panadería', 'Mejoradores, núcleos y bases', 'Base Soft al 20% para la elaboración de todo tipo de masas especiales tipo hot dog, hamburguesa y pan de molde.', 'Saco 10 Kg.', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 0, 'https://www.asitec.cl/mejoradores-nucleos-y-bases-para-panaderia-rapidox/'),
('panader-a-37', 'Núcleo soft al 10%', 'Panadería', 'Mejoradores, núcleos y bases', 'Núcleo Soft al 10%, sin materia grasa, para la elaboración de todo tipo de masas especiales tipo hot dog, hamburguesa y pan de molde.', 'Saco 10 Kg.', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 0, 'https://www.asitec.cl/mejoradores-nucleos-y-bases-para-panaderia-rapidox/'),
('panader-a-38', 'Levadura Rapidox Up Bakery 20 x 500 g.', 'Panadería', 'Levadura Instantánea Rapidox Up Bakery', 'Levadura instantánea para elaborar productos de panificación, se debe aplicar directo a la harina.', 'Caja de 20 dosis de 500 g', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2019/07/levadura-instantanea-rapidox-500g.jpg', 0, 'https://www.asitec.cl/levadura-instantanea-rapidox-up-bakery/'),
('panader-a-39', 'Levadura Rapidox Up Bakery 360 x 11 g.', 'Panadería', 'Levadura Instantánea Rapidox Up Bakery', 'Levadura instantánea de uso casero para elaborar productos de panadería, se debe aplicar directo a la harina.', 'Caja de 360 dosis de 11 g.', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', 'https://www.asitec.cl/wp-content/uploads/2019/07/levadura-instantanea-rapidox-11g.jpg', 0, 'https://www.asitec.cl/levadura-instantanea-rapidox-up-bakery/'),
('insumos-para-molinos-40', 'Mix vitamínico', 'Insumos para Molinos', 'Línea Molinera Rapidox', '', 'Saco 25 Kg.', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 1, 'https://www.asitec.cl/insumos-para-molinos-rapidox/'),
('insumos-para-molinos-41', 'Mix enzimático para harinas', 'Insumos para Molinos', 'Línea Molinera Rapidox', '', 'Saco 25 Kg.', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Chile', '', 0, 'https://www.asitec.cl/insumos-para-molinos-rapidox/'),
('insumos-para-molinos-42', 'Blanqueador de harinas', 'Insumos para Molinos', 'Línea Molinera Rapidox', '', 'Saco 25 Kg.', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'Corea', '', 1, 'https://www.asitec.cl/insumos-para-molinos-rapidox/'),
('insumos-para-molinos-43', 'Ácido ascórbico', 'Insumos para Molinos', 'Línea Molinera Rapidox', '', 'Caja 25 Kg.', '24 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'China', '', 0, 'https://www.asitec.cl/insumos-para-molinos-rapidox/'),
('insumos-para-molinos-44', 'Gluten de trigo', 'Insumos para Molinos', 'Línea Molinera Rapidox', '', 'Saco 25 Kg.', '24 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado.', 'China', '', 0, 'https://www.asitec.cl/insumos-para-molinos-rapidox/'),
('insumos-para-molinos-45', 'Productos importados', 'Insumos para Molinos', 'Molinera Importados', '', 'Saco 25 Kg.', '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y envase cerrado. ÁCIDO ASCÓRBICO', 'Corea', '', 0, 'https://www.asitec.cl/productos-molineria-importados/');

-- --------------------------------------------------------
-- 4. Tabla de Certificaciones y Acreditaciones Oficiales
-- --------------------------------------------------------
DROP TABLE IF EXISTS `certifications`;
CREATE TABLE `certifications` (
  `id` varchar(100) NOT NULL,
  `badge` varchar(100) NOT NULL,
  `institution` varchar(255) NOT NULL,
  `resolution` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT '100% Vigente',
  `document_url` text DEFAULT NULL,
  `year` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `certifications` (`id`, `badge`, `institution`, `resolution`, `detail`, `status`, `document_url`, `year`) VALUES
('sag-6805-2016', 'Acreditación Oficial', 'Servicio Agrícola y Ganadero (SAG)', 'Laboratorio Calibrado y Certificado: Resolución Exenta Nº 6805 / 2016', 'Asitec S.A. se encuentra registrado como laboratorio certificado y calibrado para nuestra línea de análisis de molinería y panificación en todo el territorio nacional.', '100% Vigente', 'https://www.asitec.cl/catalogos/Catalogo_Industrial_Asitec.pdf', '2016'),
('inocuidad-haccp', 'Inocuidad Alimentaria', 'Estándares HACCP / BPM', 'Buenas Prácticas de Manufactura en Plantas de Mezclado', 'Procesos de formulación, dosificación y envasado de premezclas bajo rigurosos protocolos de inocuidad alimentaria y trazabilidad de lotes.', '100% Vigente', '', '2024');

-- --------------------------------------------------------
-- 5. Tabla de Recetas y Aplicaciones Técnicas en Video
-- --------------------------------------------------------
DROP TABLE IF EXISTS `recipes`;
CREATE TABLE `recipes` (
  `id` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `difficulty` varchar(50) NOT NULL,
  `video_url` text NOT NULL,
  `thumbnail` text NOT NULL,
  `description` text NOT NULL,
  `recommended_product` varchar(255) NOT NULL,
  `key_steps` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `recipes` (`id`, `title`, `category`, `duration`, `difficulty`, `video_url`, `thumbnail`, `description`, `recommended_product`, `key_steps`) VALUES
('crema-chantilly', 'Crema Chantilly Perfecta', 'Pastelería', '5 min', 'Fácil', 'https://www.asitec.cl/wp-content/uploads/2024/05/Crema-chantilly.mp4', '', 'Aprende a preparar y batir Crema Chantilly con volumen estable, textura tersa y sin desuerar, ideal para decoraciones finas.', 'Base Crema Chantilly Asitec', '["Disolver la base Chantilly en leche o agua fría (4°C a 6°C).","Batir a velocidad media durante 1 minuto para homogenizar.","Aumentar a velocidad máxima por 3 a 4 minutos hasta obtener picos firmes.","Refrigerar 15 minutos antes de manguear."]'),
('brownie-fudge', 'Brownie Americano Crocante y Húmedo', 'Pastelería', '25 min', 'Fácil', 'https://www.asitec.cl/wp-content/uploads/2024/05/Brownie.mp4', '', 'Elaboración de Brownie estilo fudge con costra craquelada brillante y centro chocolatoso denso y húmedo.', 'Premezcla Brownie Asitec', '["Mezclar la Premezcla Brownie con agua y materia grasa según dosificación.","Batir en primera velocidad por 2 minutos hasta integrar sin sobrebatir.","Verter en bandeja con papel mantequilla o desmoldante.","Hornear a 180°C durante 22 a 25 minutos. Enfriar completamente antes de cortar."]'),
('queque-vainilla-chocolate', 'Queque Marmolado Vainilla y Chocolate', 'Pastelería', '40 min', 'Intermedio', 'https://www.asitec.cl/wp-content/uploads/2024/05/queque-vainilla-chocolate.mp4', '', 'Combinación armoniosa de queque esponjoso sabor vainilla con vetas de chocolate belga.', 'Premezclas Queques Asitec', '["Elaborar el batido base con Premezcla Queque Vainilla, huevos, aceite y agua.","Dividir una porción del batido e incorporar cacao puro.","Alternar capas en el molde y generar efecto marmolado con espátula.","Hornear a 170°C por 35-40 minutos."]'),
('bizcocho-vainilla', 'Bizcocho Clásico de Gran Volumen', 'Pastelería', '30 min', 'Fácil', 'https://www.asitec.cl/wp-content/uploads/2024/05/bizcocho-vainilla.mp4', '', 'Técnica profesional para brazos de reina, empolvados y tortas tradicionales con miga ligera y aireada.', 'Premezcla Bizcocho Vainilla Asitec', '["Incorporar huevos y agua a la Premezcla Bizcocho Asitec.","Batir a velocidad alta durante 8 a 10 minutos para máxima aireación.","Dosificar en moldes circulares o bandejas para brazo de reina.","Hornear a 190°C por 18 a 22 minutos."]'),
('muffins-gourmet', 'Muffins con Copete Gourmet', 'Pastelería', '25 min', 'Fácil', 'https://www.asitec.cl/wp-content/uploads/2024/05/muffins.mp4', '', 'Muffins de gran desarrollo vertical, corona agrietada dorada y miga excepcionalmente suave.', 'Premezcla Muffins Vainilla Asitec', '["Mezclar Premezcla Muffins con huevos, aceite y agua.","Opcional: incorporar chips de chocolate, arándanos o nueces.","Dosificar en cápsulas de papel llenando al 80% de capacidad.","Hornear a 190°C durante 20 minutos."]'),
('masas-dulces', 'Masas Dulces Tradicionales y Facturas', 'Pastelería', '45 min', 'Intermedio', 'https://www.asitec.cl/wp-content/uploads/2024/05/masas-dulces.mp4', '', 'Preparación de trenzas, berlinesas, rollos de canela y donas con miga hilada de excelente conservación.', 'Premezcla Masas Dulces Asitec', '["Amasar hasta lograr punto de velo o elasticidad completa.","Formar piezas y fermentar en cámara a 30°C con 75% de humedad.","Hornear o freír según la preparación deseada.","Rellenar con Crema Pastelera Asitec."]'),
('queque-berries-naranja', 'Queque de Berries y Naranja', 'Pastelería', '45 min', 'Fácil', 'https://www.asitec.cl/wp-content/uploads/2024/05/queque-berries-naranja.mp4', '', 'Elaboración de queque esponjoso y aromático combinando notas cítricas de naranja y frutos del bosque.', 'Premezcla Queque Berries y Naranja Asitec', '["Mezclar Premezcla Queque Berries y Naranja con huevos, aceite y agua.","Batir a velocidad media durante 3 a 4 minutos.","Dosificar en moldes rectangulares o de corona.","Hornear a 170°C durante 40 a 45 minutos."]'),
('cocadas', 'Cocadas Horneadas Artesanales', 'Pastelería', '20 min', 'Fácil', 'https://www.asitec.cl/wp-content/uploads/2024/05/cocadas.mp4', '', 'Preparación rápida de cocadas tradicionales con dorado parejo, exterior crocante y centro tierno y aromático a coco.', 'Premezcla Cocadas Asitec', '["Mezclar la Premezcla Cocadas Asitec con agua caliente según dosificación técnica.","Homogenizar con espátula hasta lograr una masa maleable.","Manguear o bolear las porciones sobre lata engrasada.","Hornear a 200°C por 10 a 12 minutos hasta obtener dorado parejo."]');

-- --------------------------------------------------------
-- 6. Tabla de Ajustes Generales del Sitio Web
-- --------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('company_name', 'ASITEC S.A.'),
('company_tagline', 'Innovación, Tecnología & Servicio'),
('company_description', 'Líderes en Chile en desarrollo y comercialización de materias primas, premezclas de alta gama, mejoradores de panificación, aditivos molineros y calibración de equipos analíticos certificados por el SAG.'),
('contact_address', 'Chañarcillo # 691, Maipú, Santiago de Chile'),
('contact_phone', '22 616 0200'),
('contact_phone_raw', '+56226160200'),
('contact_whatsapp', '+56992671171'),
('contact_email', 'info@asitec.cl'),
('contact_working_hours', 'Lunes a Viernes: 08:30 - 18:00 hrs'),
('contact_maps_url', 'https://maps.google.com/?q=Chañarcillo+691,+Maipu,+Santiago'),
('bank_name', 'Banco de Chile'),
('bank_account_holder', 'Asitec S.A.'),
('bank_account_type', 'Cuenta Corriente'),
('bank_account_number', '463260301'),
('bank_rut', '96.852.140-5'),
('bank_payment_email', 'pagos@asitec.cl'),
('distributor_region', 'Tercera y Cuarta Región (Atacama y Coquimbo)'),
('distributor_company', 'Sociedad Comercial Ataelqui'),
('distributor_contact', 'Carlos González'),
('distributor_phone', '+56 9 9267 1171'),
('distributor_phone_raw', '+56992671171'),
('distributor_email', 'cgonzalez@ataelqui.cl'),
('distributor_catalog_url', 'https://vercatalogo.com/ataelqui');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
