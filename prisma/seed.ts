import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

import "dotenv/config";


const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding...')

  // Seed Map Points
  const mapPoints = await Promise.all([
    prisma.mapPoint.create({
      data: {
        type: 'water',
        lat: 42.15,
        lng: 41.67,
        status: 'normal',
        title: 'Sampling Point A',
        description: 'Water quality: Normal',
      },
    }),
    prisma.mapPoint.create({
      data: {
        type: 'water',
        lat: 42.16,
        lng: 41.68,
        status: 'warning',
        title: 'Sampling Point B',
        description: 'Elevated turbidity detected',
      },
    }),
    prisma.mapPoint.create({
      data: {
        type: 'water',
        lat: 42.14,
        lng: 41.66,
        status: 'problem',
        title: 'Sampling Point C',
        description: 'High pollution levels',
      },
    }),
    prisma.mapPoint.create({
      data: {
        type: 'pollution',
        lat: 42.155,
        lng: 41.675,
        status: 'problem',
        title: 'Waste Accumulation',
        description: 'Citizen report: Illegal dumping',
      },
    }),
    prisma.mapPoint.create({
      data: {
        type: 'risk',
        lat: 42.145,
        lng: 41.665,
        status: 'warning',
        title: 'Flood Risk Zone',
        description: 'High risk during heavy rainfall',
      },
    }),
    prisma.mapPoint.create({
      data: {
        type: 'infrastructure',
        lat: 42.158,
        lng: 41.672,
        status: 'problem',
        title: 'Blocked Drainage',
        description: 'Requires immediate maintenance',
      },
    }),
  ])

  console.log(`Created ${mapPoints.length} map points`)

  // Seed Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        slug: 'kaparchina',
        title: 'Kaparchina River: Climate Resilience & Citizen Monitoring',
        description:
          'Comprehensive environmental monitoring and community engagement program for the Kaparchina River ecosystem, combining scientific data collection with citizen participation.',
        status: 'Active',
        duration: '2023 - 2025',
        icon: 'Droplet',
        color: 'bg-blue-600',
        goals: ['Water quality monitoring', 'Pollution mapping', 'Community engagement', 'Policy recommendations'],
        headerImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=600&fit=crop',
        content: `The Kaparchina River project represents a comprehensive approach to environmental monitoring and climate resilience building in Poti, Georgia. This initiative combines rigorous scientific assessment with active community participation to create sustainable solutions for local environmental challenges.

## Project Overview

The Kaparchina River has long been a vital water source for the Poti region, but faces increasing pressures from pollution, climate change, and inadequate infrastructure. Our project addresses these challenges through systematic monitoring, data-driven analysis, and evidence-based advocacy.

## Methodology

Our approach integrates multiple research methods including water quality testing, biodiversity surveys, pollution mapping, and climate risk assessment. We conduct monthly sampling at 12 key locations along the river, analyzing parameters such as dissolved oxygen, pH levels, turbidity, and presence of contaminants.

Community observers play a crucial role in expanding our monitoring capacity. Trained residents conduct regular observations and report environmental concerns through our digital platform, creating a comprehensive picture of the river's health over time.

## Key Findings

Our monitoring has revealed several critical issues requiring immediate attention. Water quality varies significantly across different sections of the river, with pollution hotspots identified near industrial zones and areas with inadequate drainage systems.

Climate impacts are becoming increasingly evident, with more frequent flooding events and changes in water flow patterns. These findings inform our policy recommendations and guide local authorities in prioritizing infrastructure improvements.

## Community Impact

Beyond scientific data, this project has strengthened community awareness and engagement. Over 200 local residents have participated in workshops and training sessions, learning about environmental monitoring and climate adaptation strategies.

The project has catalyzed local action, with community-led cleanup initiatives and advocacy for better waste management systems. This bottom-up approach ensures sustainability and local ownership of environmental solutions.`,
        contentSections: [
          { type: 'text', content: 'The Kaparchina River project represents a comprehensive approach to environmental monitoring and climate resilience building in Poti, Georgia.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=500&fit=crop' },
          { type: 'text', content: 'Our approach integrates multiple research methods including water quality testing, biodiversity surveys, pollution mapping, and climate risk assessment. We conduct monthly sampling at 12 key locations along the river.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=500&fit=crop' },
          { type: 'text', content: 'Community observers play a crucial role in expanding our monitoring capacity. Trained residents conduct regular observations and report environmental concerns through our digital platform.' },
        ],
      },
    }),
    prisma.project.create({
      data: {
        slug: 'c-ron',
        title: 'Community River Observers Network (C-RON)',
        description:
          'Training and empowering local citizens to become active environmental monitors through structured observation protocols and data collection methods.',
        status: 'Active',
        duration: '2024 - Ongoing',
        icon: 'Users',
        color: 'bg-green-600',
        goals: ['Train 50+ observers', 'Monthly monitoring', 'Youth involvement', 'Data reporting system'],
        headerImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop',
        content: `The Community River Observers Network (C-RON) empowers local citizens to become active participants in environmental monitoring. Through systematic training and structured protocols, community members contribute valuable data while building environmental literacy and civic engagement.

## Program Structure

C-RON participants receive comprehensive training in observation techniques, water quality assessment, and data reporting. The program includes both classroom instruction and hands-on field practice, ensuring observers are confident and competent in their monitoring activities.

Each observer commits to monthly monitoring activities at assigned locations along the river. They use standardized forms and our mobile app to record observations, take photos, and report concerns. This systematic approach ensures data quality and consistency across all monitoring points.

## Training Curriculum

Our training program covers multiple topics essential for effective environmental monitoring. Participants learn about river ecology, common pollution sources, climate impacts, and the importance of accurate data collection.

Safety protocols are a key component, ensuring observers can conduct their activities without risk. We also emphasize the role of citizen science in democratic governance and environmental protection.

## Observer Impact

Since launching in 2024, C-RON has engaged over 60 active observers representing diverse community segments. Youth participants bring enthusiasm and tech-savviness, while elder observers contribute deep local knowledge and historical perspective.

The network has documented numerous environmental concerns that might otherwise have gone unnoticed. Quick reporting has enabled faster response to pollution incidents and informed maintenance priorities for local authorities.

## Community Building

Beyond data collection, C-RON strengthens community bonds and collective action. Regular observer meetings provide space for sharing experiences, discussing environmental trends, and coordinating advocacy efforts.

The program demonstrates how citizen participation can complement professional monitoring, creating more comprehensive and responsive environmental governance systems.`,
        contentSections: [
          { type: 'text', content: 'The Community River Observers Network (C-RON) empowers local citizens to become active participants in environmental monitoring through systematic training and structured protocols.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=500&fit=crop' },
          { type: 'text', content: 'Each observer commits to monthly monitoring activities at assigned locations. They use standardized forms and our mobile app to record observations, take photos, and report concerns.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=500&fit=crop' },
        ],
      },
    }),
    prisma.project.create({
      data: {
        slug: 'governance',
        title: 'Local Climate Governance Initiatives',
        description:
          'Building capacity for climate action through evidence-based policy recommendations and dialogue with local authorities to strengthen environmental governance.',
        status: 'Active',
        duration: '2024 - 2026',
        icon: 'Shield',
        color: 'bg-slate-700',
        goals: ['Policy briefs', 'Stakeholder workshops', 'Advocacy campaigns', 'Institutional strengthening'],
        headerImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop',
        content: `Effective climate action requires strong governance systems and evidence-based policy making. Our governance initiatives bridge the gap between scientific findings and policy implementation, working with local authorities to develop practical, sustainable solutions.

## Policy Development

We translate research findings into clear, actionable policy recommendations. Our briefs address critical issues such as drainage infrastructure, waste management, flood preparedness, and river protection measures.

Each recommendation is grounded in data from our monitoring programs and considers local context, resource constraints, and implementation feasibility. We prioritize solutions that deliver multiple benefits and align with national climate commitments.

## Stakeholder Engagement

Building effective governance requires collaboration across sectors. We facilitate dialogue between government officials, community representatives, private sector actors, and civil society organizations.

Regular stakeholder workshops create space for information sharing, problem solving, and coordination. These meetings help align different perspectives and build consensus around priority actions.

## Advocacy Strategy

Our advocacy combines technical expertise with grassroots mobilization. We present evidence directly to decision-makers while mobilizing community support for environmental protection measures.

Public campaigns raise awareness about environmental issues and build political will for action. Media engagement amplifies community voices and holds authorities accountable for environmental commitments.

## Institutional Capacity

We work to strengthen local institutions' capacity for environmental management. This includes training for municipal staff, support for monitoring systems, and assistance with planning processes.

Technical assistance helps local authorities access funding opportunities and develop project proposals for environmental infrastructure improvements.

## Long-term Vision

Our governance work aims to institutionalize participatory environmental management. We advocate for permanent mechanisms that ensure community input in environmental decisions and transparent reporting on environmental performance.`,
        contentSections: [
          { type: 'text', content: 'Effective climate action requires strong governance systems and evidence-based policy making. Our initiatives bridge the gap between scientific findings and policy implementation.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop' },
          { type: 'text', content: 'Regular stakeholder workshops create space for information sharing, problem solving, and coordination across sectors including government, community, and civil society.' },
        ],
      },
    }),
    prisma.project.create({
      data: {
        slug: 'youth',
        title: 'Youth Environmental Leadership Program',
        description:
          'Engaging young people in environmental stewardship through education, field activities, and leadership development opportunities.',
        status: 'Planning',
        duration: '2025 - 2026',
        icon: 'Target',
        color: 'bg-orange-600',
        goals: ['Youth training', 'School programs', 'Leadership skills', 'Peer education'],
        headerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop',
        content: `Young people are both the most impacted by climate change and the most essential agents of change. Our Youth Environmental Leadership Program will equip the next generation with knowledge, skills, and networks to drive environmental action in their communities.

## Program Vision

The program will engage youth aged 14-24 through multiple pathways including school partnerships, youth clubs, internships, and peer education initiatives. We aim to make environmental education accessible, relevant, and action-oriented.

Participants will gain both scientific knowledge and practical skills, from understanding climate science to organizing community campaigns. The program emphasizes critical thinking, problem-solving, and collaborative action.

## Curriculum Design

Our curriculum integrates environmental science, civic engagement, and leadership development. Modules cover topics such as climate change, biodiversity, pollution, sustainable development, and environmental justice.

Interactive methodologies ensure engaged learning through field trips, hands-on experiments, community projects, and dialogue with environmental professionals. Youth will also learn about career pathways in environmental fields.

## Leadership Development

Beyond knowledge, the program builds leadership capabilities. Participants will develop skills in communication, project management, advocacy, and community organizing.

Mentorship from environmental professionals and peer-to-peer learning create supportive networks. Youth will design and implement their own environmental projects, gaining practical experience and confidence.

## School Partnerships

We will partner with local schools to integrate environmental education into existing curricula. Teacher training and resource provision ensure sustainability and reach.

School environmental clubs will provide ongoing engagement opportunities and create lasting institutional change within educational systems.

## Expected Outcomes

The program aims to train 200+ youth leaders over two years, establishing a strong base of environmentally conscious young citizens. Alumni will form a network supporting each other's environmental initiatives.

Long-term, we expect program graduates to pursue environmental careers, lead community organizations, and advocate for climate action in various professional and civic roles.`,
        contentSections: [
          { type: 'text', content: 'Young people are both the most impacted by climate change and the most essential agents of change. Our program will equip the next generation with knowledge, skills, and networks.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=500&fit=crop' },
          { type: 'text', content: 'The curriculum integrates environmental science, civic engagement, and leadership development through interactive methodologies and hands-on learning.' },
        ],
      },
    }),
  ])

  console.log(`Created ${projects.length} projects`)

  // Seed Resources
  const resources = await Promise.all([
    prisma.resource.create({
      data: {
        title: 'Kaparchina River Baseline Study 2024',
        type: 'Technical Report',
        date: new Date('2024-12-01'),
        description:
          'Comprehensive environmental assessment including water quality analysis, biodiversity survey, and climate risk mapping.',
        pages: 85,
        category: 'Research',
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Climate Resilience Policy Brief: Poti Urban Area',
        type: 'Policy Document',
        date: new Date('2024-11-01'),
        description:
          'Evidence-based recommendations for local authorities on improving drainage infrastructure and flood management.',
        pages: 24,
        category: 'Policy',
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Community Monitoring Guide: River Observer Training',
        type: 'Training Material',
        date: new Date('2024-10-01'),
        description:
          'Step-by-step guide for citizen observers on water quality monitoring, data collection, and reporting protocols.',
        pages: 42,
        category: 'Training',
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Pollution Hotspot Analysis Q3 2024',
        type: 'Data Report',
        date: new Date('2024-09-01'),
        description:
          'Quarterly analysis of citizen-reported pollution incidents with geographic mapping and trend analysis.',
        pages: 18,
        category: 'Research',
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Youth Environmental Leadership Curriculum',
        type: 'Training Material',
        date: new Date('2024-08-01'),
        description:
          'Educational materials for youth programs covering environmental science, civic engagement, and leadership skills.',
        pages: 56,
        category: 'Training',
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Climate Risk Assessment: Flood Vulnerability',
        type: 'Technical Report',
        date: new Date('2024-07-01'),
        description:
          'Analysis of flood-prone areas in Poti with infrastructure recommendations and risk mitigation strategies.',
        pages: 67,
        category: 'Research',
      },
    }),
  ])

  console.log(`Created ${resources.length} resources`)

  // Seed Media Items
  const mediaItems = await Promise.all([
    prisma.mediaItem.create({
      data: {
        title: 'Community Cleanup Day Success',
        outlet: 'Local News Georgia',
        date: new Date('2024-12-15'),
        type: 'Article',
      },
    }),
    prisma.mediaItem.create({
      data: {
        title: 'Interview: Climate Action in Poti',
        outlet: 'Radio Free Europe',
        date: new Date('2024-11-28'),
        type: 'Interview',
      },
    }),
    prisma.mediaItem.create({
      data: {
        title: 'Citizen Science Making Impact',
        outlet: 'Georgia Today',
        date: new Date('2024-10-22'),
        type: 'Feature',
      },
    }),
  ])

  console.log(`Created ${mediaItems.length} media items`)

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
