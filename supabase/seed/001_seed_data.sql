-- ============================================================================
-- RADAROID - SEED DATA
-- ============================================================================
-- Execute after 001_initial_schema.sql
-- ============================================================================

-- ============================================================================
-- BRANDS
-- ============================================================================
INSERT INTO brands (slug, name, country, website, logo_url) VALUES
('tesla', 'Tesla', 'US', 'https://tesla.com', NULL),
('figure', 'Figure AI', 'US', 'https://figure.ai', NULL),
('unitree', 'Unitree Robotics', 'CN', 'https://unitree.com', NULL),
('boston-dynamics', 'Boston Dynamics', 'US', 'https://bostondynamics.com', NULL),
('agility', 'Agility Robotics', 'US', 'https://agilityrobotics.com', NULL),
('xiaomi', 'Xiaomi', 'CN', 'https://xiaomi.com', NULL),
('sanctuary', 'Sanctuary AI', 'CA', 'https://sanctuary.ai', NULL),
('1x', '1X Technologies', 'NO', 'https://1x.tech', NULL),
('apptronik', 'Apptronik', 'US', 'https://apptronik.com', NULL),
('fourier', 'Fourier Intelligence', 'CN', 'https://fftai.com', NULL);

-- ============================================================================
-- JOBS (12 metiers)
-- ============================================================================

-- 1. Warehouse Picker (Manutentionnaire)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('warehouse-picker', '{
  "criteria": {
    "payload_capacity": {
      "label": "Capacite de levage",
      "weight": 35,
      "type": "numeric",
      "unit": "kg",
      "thresholds": { "min": 10, "ideal": 30 }
    },
    "runtime_minutes": {
      "label": "Autonomie effective",
      "weight": 25,
      "type": "numeric",
      "unit": "min",
      "thresholds": { "min": 240, "ideal": 480 }
    },
    "grasping_versatility": {
      "label": "Polyvalence des mains",
      "weight": 20,
      "type": "enum_score",
      "options": {
        "suction_only": 40,
        "parallel_gripper": 60,
        "humanoid_hand_5_fingers": 100
      }
    },
    "fleet_integration": {
      "label": "Integration WMS (API)",
      "weight": 20,
      "type": "boolean",
      "required": true
    }
  }
}', 1);

-- 2. Waiter (Serveur)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('waiter', '{
  "criteria": {
    "payload_capacity": {
      "label": "Charge Utile (Plateau)",
      "weight": 20,
      "type": "numeric",
      "unit": "kg",
      "thresholds": { "min": 2, "ideal": 10 }
    },
    "interaction_tech_level": {
      "label": "Capacite Interaction (HRI)",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "none": 0,
        "basic_voice": 30,
        "screen_face": 60,
        "llm_integrated": 100
      }
    },
    "obstacle_avoidance": {
      "label": "Navigation en Foule",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "static_only": 0,
        "stop_and_wait": 50,
        "dynamic_rerouting": 100
      }
    },
    "runtime_minutes": {
      "label": "Autonomie",
      "weight": 20,
      "type": "numeric",
      "unit": "min",
      "thresholds": { "min": 120, "ideal": 480 }
    }
  }
}', 2);

-- 3. Site Laborer (Manoeuvre BTP)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('site-laborer', '{
  "criteria": {
    "ip_rating": {
      "label": "Resistance (IP Rating)",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "none": 0,
        "ip54": 60,
        "ip65": 100,
        "ip67": 100,
        "ip68": 100
      }
    },
    "terrain_handling": {
      "label": "Franchissement",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "flat_floor": 0,
        "slopes_10_deg": 50,
        "stairs_and_rubble": 100
      }
    },
    "payload_capacity": {
      "label": "Port de charge lourd",
      "weight": 25,
      "type": "numeric",
      "unit": "kg",
      "thresholds": { "min": 20, "ideal": 50 }
    },
    "teleoperation_ready": {
      "label": "Mode Teleoperation",
      "weight": 15,
      "type": "boolean",
      "required": true
    }
  }
}', 3);

-- 4. Security Patrol (Vigile)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('security-patrol', '{
  "criteria": {
    "runtime_minutes": {
      "label": "Autonomie patrouille",
      "weight": 35,
      "type": "numeric",
      "unit": "min",
      "thresholds": { "min": 360, "ideal": 720 }
    },
    "obstacle_avoidance": {
      "label": "Navigation autonome",
      "weight": 25,
      "type": "enum_score",
      "options": {
        "static_only": 0,
        "stop_and_wait": 50,
        "dynamic_rerouting": 100
      }
    },
    "interaction_tech_level": {
      "label": "Communication",
      "weight": 20,
      "type": "enum_score",
      "options": {
        "none": 0,
        "basic_voice": 50,
        "screen_face": 80,
        "llm_integrated": 100
      }
    },
    "ip_rating": {
      "label": "Resistance intemperies",
      "weight": 20,
      "type": "enum_score",
      "options": {
        "none": 0,
        "ip54": 60,
        "ip65": 100,
        "ip67": 100,
        "ip68": 100
      }
    }
  }
}', 4);

-- 5. Nurse Assistant (Assistant Hospitalier)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('nurse-assistant', '{
  "criteria": {
    "interaction_tech_level": {
      "label": "Interaction patient",
      "weight": 35,
      "type": "enum_score",
      "options": {
        "none": 0,
        "basic_voice": 30,
        "screen_face": 70,
        "llm_integrated": 100
      }
    },
    "obstacle_avoidance": {
      "label": "Navigation hopital",
      "weight": 25,
      "type": "enum_score",
      "options": {
        "static_only": 0,
        "stop_and_wait": 50,
        "dynamic_rerouting": 100
      }
    },
    "payload_capacity": {
      "label": "Transport materiel",
      "weight": 20,
      "type": "numeric",
      "unit": "kg",
      "thresholds": { "min": 5, "ideal": 20 }
    },
    "runtime_minutes": {
      "label": "Autonomie",
      "weight": 20,
      "type": "numeric",
      "unit": "min",
      "thresholds": { "min": 240, "ideal": 480 }
    }
  }
}', 5);

-- 6. Receptionist (Agent Accueil)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('receptionist', '{
  "criteria": {
    "interaction_tech_level": {
      "label": "Capacite accueil",
      "weight": 50,
      "type": "enum_score",
      "options": {
        "none": 0,
        "basic_voice": 30,
        "screen_face": 70,
        "llm_integrated": 100
      }
    },
    "obstacle_avoidance": {
      "label": "Navigation lobby",
      "weight": 20,
      "type": "enum_score",
      "options": {
        "static_only": 30,
        "stop_and_wait": 70,
        "dynamic_rerouting": 100
      }
    },
    "runtime_minutes": {
      "label": "Autonomie",
      "weight": 30,
      "type": "numeric",
      "unit": "min",
      "thresholds": { "min": 480, "ideal": 720 }
    }
  }
}', 6);

-- 7. Butler (Majordome)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('butler', '{
  "criteria": {
    "interaction_tech_level": {
      "label": "Interaction sociale",
      "weight": 40,
      "type": "enum_score",
      "options": {
        "none": 0,
        "basic_voice": 30,
        "screen_face": 60,
        "llm_integrated": 100
      }
    },
    "grasping_versatility": {
      "label": "Manipulation objets",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "suction_only": 20,
        "parallel_gripper": 60,
        "humanoid_hand_5_fingers": 100
      }
    },
    "obstacle_avoidance": {
      "label": "Navigation domicile",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "static_only": 0,
        "stop_and_wait": 50,
        "dynamic_rerouting": 100
      }
    }
  }
}', 7);

-- 8. Cook (Cuisinier)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('cook', '{
  "criteria": {
    "grasping_versatility": {
      "label": "Manipulation ustensiles",
      "weight": 40,
      "type": "enum_score",
      "options": {
        "suction_only": 0,
        "parallel_gripper": 40,
        "humanoid_hand_5_fingers": 100
      }
    },
    "dof": {
      "label": "Degres de liberte",
      "weight": 30,
      "type": "numeric",
      "unit": "DOF",
      "thresholds": { "min": 20, "ideal": 40 }
    },
    "ip_rating": {
      "label": "Resistance eau/chaleur",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "none": 0,
        "ip54": 50,
        "ip65": 80,
        "ip67": 100,
        "ip68": 100
      }
    }
  }
}', 8);

-- 9. Elderly Care (Aide Seniors)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('elderly-care', '{
  "criteria": {
    "interaction_tech_level": {
      "label": "Communication adaptee",
      "weight": 40,
      "type": "enum_score",
      "options": {
        "none": 0,
        "basic_voice": 40,
        "screen_face": 70,
        "llm_integrated": 100
      }
    },
    "obstacle_avoidance": {
      "label": "Securite navigation",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "static_only": 0,
        "stop_and_wait": 60,
        "dynamic_rerouting": 100
      }
    },
    "payload_capacity": {
      "label": "Assistance mobilite",
      "weight": 30,
      "type": "numeric",
      "unit": "kg",
      "thresholds": { "min": 10, "ideal": 30 }
    }
  }
}', 9);

-- 10. Tutor (Tuteur)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('tutor', '{
  "criteria": {
    "interaction_tech_level": {
      "label": "Capacite pedagogique",
      "weight": 60,
      "type": "enum_score",
      "options": {
        "none": 0,
        "basic_voice": 20,
        "screen_face": 50,
        "llm_integrated": 100
      }
    },
    "grasping_versatility": {
      "label": "Manipulation objets",
      "weight": 20,
      "type": "enum_score",
      "options": {
        "suction_only": 20,
        "parallel_gripper": 60,
        "humanoid_hand_5_fingers": 100
      }
    },
    "runtime_minutes": {
      "label": "Duree session",
      "weight": 20,
      "type": "numeric",
      "unit": "min",
      "thresholds": { "min": 60, "ideal": 180 }
    }
  }
}', 10);

-- 11. Gardener (Jardinier)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('gardener', '{
  "criteria": {
    "terrain_handling": {
      "label": "Navigation exterieur",
      "weight": 35,
      "type": "enum_score",
      "options": {
        "flat_floor": 0,
        "slopes_10_deg": 60,
        "stairs_and_rubble": 100
      }
    },
    "ip_rating": {
      "label": "Resistance intemperies",
      "weight": 35,
      "type": "enum_score",
      "options": {
        "none": 0,
        "ip54": 40,
        "ip65": 80,
        "ip67": 100,
        "ip68": 100
      }
    },
    "grasping_versatility": {
      "label": "Manipulation outils",
      "weight": 30,
      "type": "enum_score",
      "options": {
        "suction_only": 0,
        "parallel_gripper": 50,
        "humanoid_hand_5_fingers": 100
      }
    }
  }
}', 11);

-- 12. Dog Walker (Pet-Sitter)
INSERT INTO jobs (slug, scoring_criteria, sort_order) VALUES
('dog-walker', '{
  "criteria": {
    "terrain_handling": {
      "label": "Navigation parc",
      "weight": 35,
      "type": "enum_score",
      "options": {
        "flat_floor": 30,
        "slopes_10_deg": 70,
        "stairs_and_rubble": 100
      }
    },
    "obstacle_avoidance": {
      "label": "Evitement dynamique",
      "weight": 35,
      "type": "enum_score",
      "options": {
        "static_only": 0,
        "stop_and_wait": 40,
        "dynamic_rerouting": 100
      }
    },
    "runtime_minutes": {
      "label": "Autonomie promenade",
      "weight": 30,
      "type": "numeric",
      "unit": "min",
      "thresholds": { "min": 60, "ideal": 180 }
    }
  }
}', 12);

-- ============================================================================
-- JOBS I18N
-- ============================================================================
INSERT INTO jobs_i18n (job_id, locale, seo_title, technical_title, description)
SELECT id, 'fr', 'Robot Manutentionnaire', 'Logistique Entrepot', 'Robots pour la preparation de commandes et manutention en entrepot.' FROM jobs WHERE slug = 'warehouse-picker'
UNION ALL
SELECT id, 'en', 'Warehouse Picker Robot', 'Warehouse Logistics', 'Robots for order picking and warehouse material handling.' FROM jobs WHERE slug = 'warehouse-picker'
UNION ALL
SELECT id, 'fr', 'Robot Serveur', 'Service en Restauration', 'Robots pour le service en salle dans les restaurants et hotels.' FROM jobs WHERE slug = 'waiter'
UNION ALL
SELECT id, 'en', 'Waiter Robot', 'Restaurant Service', 'Robots for table service in restaurants and hotels.' FROM jobs WHERE slug = 'waiter'
UNION ALL
SELECT id, 'fr', 'Robot Manoeuvre BTP', 'Assistance Chantier', 'Robots pour les travaux de construction et assistance sur chantier.' FROM jobs WHERE slug = 'site-laborer'
UNION ALL
SELECT id, 'en', 'Construction Site Robot', 'Construction Assistance', 'Robots for construction work and site assistance.' FROM jobs WHERE slug = 'site-laborer'
UNION ALL
SELECT id, 'fr', 'Robot Vigile', 'Securite et Surveillance', 'Robots pour la surveillance et les rondes de securite.' FROM jobs WHERE slug = 'security-patrol'
UNION ALL
SELECT id, 'en', 'Security Patrol Robot', 'Security & Surveillance', 'Robots for surveillance and security patrols.' FROM jobs WHERE slug = 'security-patrol'
UNION ALL
SELECT id, 'fr', 'Robot Assistant Hospitalier', 'Assistance Medicale', 'Robots pour assistance aux soins et logistique hospitaliere.' FROM jobs WHERE slug = 'nurse-assistant'
UNION ALL
SELECT id, 'en', 'Nurse Assistant Robot', 'Medical Assistance', 'Robots for care assistance and hospital logistics.' FROM jobs WHERE slug = 'nurse-assistant'
UNION ALL
SELECT id, 'fr', 'Robot Agent Accueil', 'Accueil et Reception', 'Robots pour accueil visiteurs et orientation.' FROM jobs WHERE slug = 'receptionist'
UNION ALL
SELECT id, 'en', 'Receptionist Robot', 'Reception & Welcome', 'Robots for visitor welcome and guidance.' FROM jobs WHERE slug = 'receptionist'
UNION ALL
SELECT id, 'fr', 'Robot Majordome', 'Service Domestique', 'Robots pour assistance domestique haut de gamme.' FROM jobs WHERE slug = 'butler'
UNION ALL
SELECT id, 'en', 'Butler Robot', 'Domestic Service', 'Robots for high-end domestic assistance.' FROM jobs WHERE slug = 'butler'
UNION ALL
SELECT id, 'fr', 'Robot Cuisinier', 'Preparation Culinaire', 'Robots pour la preparation de repas.' FROM jobs WHERE slug = 'cook'
UNION ALL
SELECT id, 'en', 'Chef Robot', 'Culinary Preparation', 'Robots for meal preparation.' FROM jobs WHERE slug = 'cook'
UNION ALL
SELECT id, 'fr', 'Robot Aide Seniors', 'Assistance Personnes Agees', 'Robots pour accompagnement et aide aux personnes agees.' FROM jobs WHERE slug = 'elderly-care'
UNION ALL
SELECT id, 'en', 'Elderly Care Robot', 'Senior Assistance', 'Robots for elderly companionship and assistance.' FROM jobs WHERE slug = 'elderly-care'
UNION ALL
SELECT id, 'fr', 'Robot Tuteur', 'Education et Formation', 'Robots pour enseignement et accompagnement pedagogique.' FROM jobs WHERE slug = 'tutor'
UNION ALL
SELECT id, 'en', 'Tutor Robot', 'Education & Training', 'Robots for teaching and educational support.' FROM jobs WHERE slug = 'tutor'
UNION ALL
SELECT id, 'fr', 'Robot Jardinier', 'Entretien Espaces Verts', 'Robots pour entretien de jardins et espaces verts.' FROM jobs WHERE slug = 'gardener'
UNION ALL
SELECT id, 'en', 'Gardener Robot', 'Landscape Maintenance', 'Robots for garden and landscape maintenance.' FROM jobs WHERE slug = 'gardener'
UNION ALL
SELECT id, 'fr', 'Robot Pet-Sitter', 'Garde Animaux', 'Robots pour promenade et surveillance animaux.' FROM jobs WHERE slug = 'dog-walker'
UNION ALL
SELECT id, 'en', 'Pet-Sitter Robot', 'Pet Care', 'Robots for pet walking and supervision.' FROM jobs WHERE slug = 'dog-walker';

-- ============================================================================
-- ROBOTS
-- ============================================================================

-- Tesla Optimus Gen 2
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'optimus-gen-2', 'Optimus Gen 2', id, 'prototype', '{
  "payload_capacity": 20,
  "runtime_minutes": 300,
  "max_speed": 5,
  "weight_kg": 57,
  "height_cm": 173,
  "dof": 28,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "basic_voice",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "flat_floor",
  "ip_rating": "none",
  "fleet_integration": false,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'tesla';

-- Figure 02
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'figure-02', 'Figure 02', id, 'pilot', '{
  "payload_capacity": 25,
  "runtime_minutes": 300,
  "max_speed": 4.5,
  "weight_kg": 60,
  "height_cm": 170,
  "dof": 42,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "llm_integrated",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "flat_floor",
  "ip_rating": "none",
  "fleet_integration": true,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'figure';

-- Unitree H1
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'unitree-h1', 'H1', id, 'production', '{
  "payload_capacity": 30,
  "runtime_minutes": 240,
  "max_speed": 5.5,
  "weight_kg": 47,
  "height_cm": 180,
  "dof": 19,
  "grasping_versatility": "parallel_gripper",
  "interaction_tech_level": "none",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "stairs_and_rubble",
  "ip_rating": "ip54",
  "fleet_integration": true,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'unitree';

-- Unitree G1
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'unitree-g1', 'G1', id, 'production', '{
  "payload_capacity": 5,
  "runtime_minutes": 120,
  "max_speed": 7.5,
  "weight_kg": 35,
  "height_cm": 127,
  "dof": 23,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "basic_voice",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "slopes_10_deg",
  "ip_rating": "ip54",
  "fleet_integration": false,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'unitree';

-- Boston Dynamics Atlas
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'atlas', 'Atlas', id, 'prototype', '{
  "payload_capacity": 25,
  "runtime_minutes": 60,
  "max_speed": 9,
  "weight_kg": 89,
  "height_cm": 150,
  "dof": 28,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "none",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "stairs_and_rubble",
  "ip_rating": "ip65",
  "fleet_integration": false,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'boston-dynamics';

-- Boston Dynamics Spot
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'spot', 'Spot', id, 'production', '{
  "payload_capacity": 14,
  "runtime_minutes": 90,
  "max_speed": 5.8,
  "weight_kg": 32,
  "height_cm": 84,
  "dof": 12,
  "grasping_versatility": "parallel_gripper",
  "interaction_tech_level": "basic_voice",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "stairs_and_rubble",
  "ip_rating": "ip54",
  "fleet_integration": true,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'boston-dynamics';

-- Agility Digit
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'digit', 'Digit', id, 'pilot', '{
  "payload_capacity": 16,
  "runtime_minutes": 480,
  "max_speed": 5.5,
  "weight_kg": 65,
  "height_cm": 175,
  "dof": 30,
  "grasping_versatility": "parallel_gripper",
  "interaction_tech_level": "basic_voice",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "slopes_10_deg",
  "ip_rating": "ip54",
  "fleet_integration": true,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'agility';

-- Xiaomi CyberOne
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'cyberone', 'CyberOne', id, 'prototype', '{
  "payload_capacity": 1.5,
  "runtime_minutes": 180,
  "max_speed": 3.6,
  "weight_kg": 52,
  "height_cm": 177,
  "dof": 21,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "screen_face",
  "obstacle_avoidance": "stop_and_wait",
  "terrain_handling": "flat_floor",
  "ip_rating": "none",
  "fleet_integration": false,
  "teleoperation_ready": false
}'::jsonb FROM brands WHERE slug = 'xiaomi';

-- Sanctuary Phoenix
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'phoenix', 'Phoenix', id, 'pilot', '{
  "payload_capacity": 25,
  "runtime_minutes": 480,
  "max_speed": 4,
  "weight_kg": 70,
  "height_cm": 170,
  "dof": 50,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "llm_integrated",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "flat_floor",
  "ip_rating": "none",
  "fleet_integration": true,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'sanctuary';

-- 1X NEO
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'neo', 'NEO', id, 'prototype', '{
  "payload_capacity": 20,
  "runtime_minutes": 240,
  "max_speed": 4,
  "weight_kg": 30,
  "height_cm": 165,
  "dof": 30,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "llm_integrated",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "flat_floor",
  "ip_rating": "none",
  "fleet_integration": false,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = '1x';

-- 1X EVE
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'eve', 'EVE', id, 'pilot', '{
  "payload_capacity": 15,
  "runtime_minutes": 360,
  "max_speed": 3,
  "weight_kg": 86,
  "height_cm": 186,
  "dof": 22,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "screen_face",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "flat_floor",
  "ip_rating": "none",
  "fleet_integration": true,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = '1x';

-- Apptronik Apollo
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'apollo', 'Apollo', id, 'pilot', '{
  "payload_capacity": 25,
  "runtime_minutes": 240,
  "max_speed": 4,
  "weight_kg": 73,
  "height_cm": 173,
  "dof": 36,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "screen_face",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "flat_floor",
  "ip_rating": "none",
  "fleet_integration": true,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'apptronik';

-- Fourier GR-1
INSERT INTO robots (slug, name, brand_id, status, specs)
SELECT 'gr-1', 'GR-1', id, 'production', '{
  "payload_capacity": 50,
  "runtime_minutes": 120,
  "max_speed": 5,
  "weight_kg": 55,
  "height_cm": 165,
  "dof": 40,
  "grasping_versatility": "humanoid_hand_5_fingers",
  "interaction_tech_level": "basic_voice",
  "obstacle_avoidance": "dynamic_rerouting",
  "terrain_handling": "flat_floor",
  "ip_rating": "none",
  "fleet_integration": true,
  "teleoperation_ready": true
}'::jsonb FROM brands WHERE slug = 'fourier';

-- ============================================================================
-- ROBOTS I18N
-- ============================================================================
INSERT INTO robots_i18n (robot_id, locale, tagline, description)
SELECT id, 'fr', 'Le robot humanoide de Tesla', 'Optimus Gen 2 est le robot humanoide de Tesla, concu pour effectuer des taches repetitives et dangereuses.' FROM robots WHERE slug = 'optimus-gen-2'
UNION ALL
SELECT id, 'en', 'Tesla''s humanoid robot', 'Optimus Gen 2 is Tesla''s humanoid robot, designed to perform repetitive and dangerous tasks.' FROM robots WHERE slug = 'optimus-gen-2'
UNION ALL
SELECT id, 'fr', 'Robot humanoide avec IA integree', 'Figure 02 integre les modeles de langage OpenAI pour une interaction naturelle.' FROM robots WHERE slug = 'figure-02'
UNION ALL
SELECT id, 'en', 'Humanoid robot with integrated AI', 'Figure 02 integrates OpenAI language models for natural interaction.' FROM robots WHERE slug = 'figure-02'
UNION ALL
SELECT id, 'fr', 'Robot humanoide haute performance', 'H1 est le robot humanoide phare de Unitree, capable de courir et sauter.' FROM robots WHERE slug = 'unitree-h1'
UNION ALL
SELECT id, 'en', 'High-performance humanoid robot', 'H1 is Unitree''s flagship humanoid robot, capable of running and jumping.' FROM robots WHERE slug = 'unitree-h1'
UNION ALL
SELECT id, 'fr', 'Robot humanoide compact et agile', 'G1 est un robot humanoide compact de Unitree, optimise pour la recherche.' FROM robots WHERE slug = 'unitree-g1'
UNION ALL
SELECT id, 'en', 'Compact and agile humanoid robot', 'G1 is a compact humanoid robot from Unitree, optimized for research.' FROM robots WHERE slug = 'unitree-g1'
UNION ALL
SELECT id, 'fr', 'Robot acrobatique de recherche', 'Atlas est le robot de recherche de Boston Dynamics, connu pour ses capacites acrobatiques.' FROM robots WHERE slug = 'atlas'
UNION ALL
SELECT id, 'en', 'Acrobatic research robot', 'Atlas is Boston Dynamics'' research robot, known for its acrobatic capabilities.' FROM robots WHERE slug = 'atlas'
UNION ALL
SELECT id, 'fr', 'Robot quadrupede polyvalent', 'Spot est le robot quadrupede de Boston Dynamics, deploye dans l''industrie.' FROM robots WHERE slug = 'spot'
UNION ALL
SELECT id, 'en', 'Versatile quadruped robot', 'Spot is Boston Dynamics'' quadruped robot, deployed in industry.' FROM robots WHERE slug = 'spot'
UNION ALL
SELECT id, 'fr', 'Robot logistique bipede', 'Digit est concu pour la logistique et la livraison du dernier kilometre.' FROM robots WHERE slug = 'digit'
UNION ALL
SELECT id, 'en', 'Bipedal logistics robot', 'Digit is designed for logistics and last-mile delivery.' FROM robots WHERE slug = 'digit'
UNION ALL
SELECT id, 'fr', 'Robot humanoide emotionnel', 'CyberOne peut detecter les emotions humaines et y repondre.' FROM robots WHERE slug = 'cyberone'
UNION ALL
SELECT id, 'en', 'Emotional humanoid robot', 'CyberOne can detect human emotions and respond to them.' FROM robots WHERE slug = 'cyberone'
UNION ALL
SELECT id, 'fr', 'Robot avec cognition generale', 'Phoenix utilise l''IA de Sanctuary pour des taches cognitives complexes.' FROM robots WHERE slug = 'phoenix'
UNION ALL
SELECT id, 'en', 'General cognition robot', 'Phoenix uses Sanctuary''s AI for complex cognitive tasks.' FROM robots WHERE slug = 'phoenix'
UNION ALL
SELECT id, 'fr', 'Robot domestique nouvelle generation', 'NEO est concu pour l''assistance domestique grand public.' FROM robots WHERE slug = 'neo'
UNION ALL
SELECT id, 'en', 'Next-gen domestic robot', 'NEO is designed for consumer domestic assistance.' FROM robots WHERE slug = 'neo'
UNION ALL
SELECT id, 'fr', 'Robot de securite autonome', 'EVE est deploye pour la surveillance et securite.' FROM robots WHERE slug = 'eve'
UNION ALL
SELECT id, 'en', 'Autonomous security robot', 'EVE is deployed for surveillance and security.' FROM robots WHERE slug = 'eve'
UNION ALL
SELECT id, 'fr', 'Robot collaboratif industriel', 'Apollo est concu pour travailler aux cotes des humains en usine.' FROM robots WHERE slug = 'apollo'
UNION ALL
SELECT id, 'en', 'Industrial collaborative robot', 'Apollo is designed to work alongside humans in factories.' FROM robots WHERE slug = 'apollo'
UNION ALL
SELECT id, 'fr', 'Robot humanoide medical', 'GR-1 est specialise pour les applications de readaptation.' FROM robots WHERE slug = 'gr-1'
UNION ALL
SELECT id, 'en', 'Medical humanoid robot', 'GR-1 specializes in rehabilitation applications.' FROM robots WHERE slug = 'gr-1';

-- ============================================================================
-- GLOSSARY TERMS
-- ============================================================================
INSERT INTO glossary_terms (slug, category) VALUES
('dof', 'hardware'),
('slam', 'software'),
('lidar', 'hardware'),
('hri', 'software'),
('wms', 'business'),
('amr', 'hardware'),
('cobot', 'hardware'),
('end-effector', 'hardware'),
('payload', 'hardware'),
('ip-rating', 'hardware');

INSERT INTO glossary_terms_i18n (term_id, locale, term, definition_short, definition_long)
SELECT id, 'fr', 'Degres de liberte (DOF)', 'Nombre d''axes de mouvement independants', 'Les degres de liberte representent le nombre d''axes sur lesquels un robot peut se deplacer independamment. Plus le nombre est eleve, plus le robot est polyvalent.' FROM glossary_terms WHERE slug = 'dof'
UNION ALL
SELECT id, 'en', 'Degrees of Freedom (DOF)', 'Number of independent movement axes', 'Degrees of freedom represent the number of axes on which a robot can move independently. Higher numbers mean more versatility.' FROM glossary_terms WHERE slug = 'dof'
UNION ALL
SELECT id, 'fr', 'SLAM', 'Localisation et cartographie simultanees', 'Technique permettant a un robot de construire une carte de son environnement tout en s''y localisant.' FROM glossary_terms WHERE slug = 'slam'
UNION ALL
SELECT id, 'en', 'SLAM', 'Simultaneous Localization and Mapping', 'Technique allowing a robot to build a map of its environment while localizing itself within it.' FROM glossary_terms WHERE slug = 'slam'
UNION ALL
SELECT id, 'fr', 'LiDAR', 'Detection par laser', 'Capteur utilisant des lasers pour mesurer les distances et creer des cartes 3D de l''environnement.' FROM glossary_terms WHERE slug = 'lidar'
UNION ALL
SELECT id, 'en', 'LiDAR', 'Laser detection', 'Sensor using lasers to measure distances and create 3D maps of the environment.' FROM glossary_terms WHERE slug = 'lidar'
UNION ALL
SELECT id, 'fr', 'HRI', 'Interaction Homme-Robot', 'Domaine etudiant comment les robots et les humains peuvent interagir de maniere efficace et naturelle.' FROM glossary_terms WHERE slug = 'hri'
UNION ALL
SELECT id, 'en', 'HRI', 'Human-Robot Interaction', 'Field studying how robots and humans can interact effectively and naturally.' FROM glossary_terms WHERE slug = 'hri'
UNION ALL
SELECT id, 'fr', 'WMS', 'Systeme de gestion d''entrepot', 'Logiciel gerant les operations d''un entrepot, incluant l''inventaire et la preparation de commandes.' FROM glossary_terms WHERE slug = 'wms'
UNION ALL
SELECT id, 'en', 'WMS', 'Warehouse Management System', 'Software managing warehouse operations, including inventory and order picking.' FROM glossary_terms WHERE slug = 'wms'
UNION ALL
SELECT id, 'fr', 'AMR', 'Robot Mobile Autonome', 'Robot capable de naviguer de maniere autonome sans infrastructure fixe.' FROM glossary_terms WHERE slug = 'amr'
UNION ALL
SELECT id, 'en', 'AMR', 'Autonomous Mobile Robot', 'Robot capable of navigating autonomously without fixed infrastructure.' FROM glossary_terms WHERE slug = 'amr'
UNION ALL
SELECT id, 'fr', 'Cobot', 'Robot collaboratif', 'Robot concu pour travailler en securite aux cotes des humains.' FROM glossary_terms WHERE slug = 'cobot'
UNION ALL
SELECT id, 'en', 'Cobot', 'Collaborative Robot', 'Robot designed to work safely alongside humans.' FROM glossary_terms WHERE slug = 'cobot'
UNION ALL
SELECT id, 'fr', 'Effecteur terminal', 'Outil en bout de bras', 'Dispositif fixe a l''extremite d''un bras robotique (pince, ventouse, main).' FROM glossary_terms WHERE slug = 'end-effector'
UNION ALL
SELECT id, 'en', 'End Effector', 'Tool at arm end', 'Device attached to the end of a robotic arm (gripper, suction cup, hand).' FROM glossary_terms WHERE slug = 'end-effector'
UNION ALL
SELECT id, 'fr', 'Charge utile', 'Capacite de levage', 'Poids maximum qu''un robot peut soulever ou transporter.' FROM glossary_terms WHERE slug = 'payload'
UNION ALL
SELECT id, 'en', 'Payload', 'Lifting capacity', 'Maximum weight a robot can lift or carry.' FROM glossary_terms WHERE slug = 'payload'
UNION ALL
SELECT id, 'fr', 'Indice IP', 'Protection contre l''eau et poussiere', 'Norme definissant le niveau de protection d''un equipement (ex: IP65 = etanche poussiere et jets d''eau).' FROM glossary_terms WHERE slug = 'ip-rating'
UNION ALL
SELECT id, 'en', 'IP Rating', 'Water and dust protection', 'Standard defining equipment protection level (e.g., IP65 = dust-tight and water jets protected).' FROM glossary_terms WHERE slug = 'ip-rating';

-- ============================================================================
-- DONE!
-- ============================================================================
