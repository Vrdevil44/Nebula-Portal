import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const DashboardCharts = ({ dataset, timeRange, viewMode, darkMode }) => {
  const chartContainerRef = useRef(null);
  const galaxyMapRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Generate mock data based on dataset and timeRange
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const generatedData = generateMockData(dataset, timeRange);
      setData(generatedData);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [dataset, timeRange]);
  
  // Render appropriate visualization based on viewMode
  useEffect(() => {
    if (!data || loading) return;
    
    if (viewMode === 'charts') {
      renderCharts();
    } else {
      renderGalaxyMap();
    }
  }, [data, loading, viewMode, darkMode]);
  
  // Generate mock data for different datasets
  const generateMockData = (datasetType, timeRangeValue) => {
    switch (datasetType) {
      case 'stars':
        return generateStarData(timeRangeValue);
      case 'planets':
        return generatePlanetData(timeRangeValue);
      case 'galaxies':
        return generateGalaxyData(timeRangeValue);
      case 'discoveries':
        return generateDiscoveryData(timeRangeValue);
      default:
        return [];
    }
  };
  
  // Generate star classification data
  const generateStarData = (timeRange) => {
    const spectralTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
    const luminosityClasses = ['I', 'II', 'III', 'IV', 'V'];
    
    const data = [];
    
    // Generate distribution based on real astronomical distributions
    // O stars are rare, M stars are common
    const typeDistribution = [0.00003, 0.0013, 0.006, 0.03, 0.076, 0.121, 0.765];
    
    spectralTypes.forEach((type, typeIndex) => {
      luminosityClasses.forEach((lumClass, lumIndex) => {
        // Adjust for time range - newer observations have more data
        const timeMultiplier = timeRange === 'all' ? 1 :
                              timeRange === 'century' ? 0.8 :
                              timeRange === 'decade' ? 0.5 : 0.2;
        
        // Calculate count based on distribution
        // Main sequence (class V) stars are most common
        const lumClassFactor = lumClass === 'V' ? 0.7 : 
                              (lumClass === 'IV' || lumClass === 'III') ? 0.2 : 0.1;
        
        const count = Math.round(typeDistribution[typeIndex] * 10000 * lumClassFactor * timeMultiplier);
        
        // Temperature based on spectral type (in Kelvin)
        const temperatures = {
          'O': 30000 + Math.random() * 10000,
          'B': 10000 + Math.random() * 10000,
          'A': 7500 + Math.random() * 1500,
          'F': 6000 + Math.random() * 1500,
          'G': 5200 + Math.random() * 800,
          'K': 3700 + Math.random() * 1500,
          'M': 2400 + Math.random() * 1300
        };
        
        // Color based on temperature
        const getStarColor = (temp) => {
          if (temp > 30000) return '#9bb0ff'; // Blue
          if (temp > 10000) return '#aabfff'; // Blue-white
          if (temp > 7500) return '#cad7ff';  // White
          if (temp > 6000) return '#f8f7ff';  // Yellow-white
          if (temp > 5200) return '#fff4ea';  // Yellow
          if (temp > 3700) return '#ffd2a1';  // Orange
          return '#ffcc6f';                   // Red
        };
        
        data.push({
          id: `${type}${lumClass}`,
          spectralType: type,
          luminosityClass: lumClass,
          count: count,
          temperature: temperatures[type],
          color: getStarColor(temperatures[type]),
          radius: type === 'O' ? 10 : 
                 type === 'B' ? 7 :
                 type === 'A' ? 5 :
                 type === 'F' ? 4 :
                 type === 'G' ? 3 :
                 type === 'K' ? 2 : 1,
          description: getStarDescription(type, lumClass)
        });
      });
    });
    
    return {
      type: 'stars',
      items: data,
      title: 'Star Classification',
      subtitle: 'Distribution by spectral type and luminosity class'
    };
  };
  
  // Generate exoplanet data
  const generatePlanetData = (timeRange) => {
    const detectionMethods = [
      'Transit', 
      'Radial Velocity', 
      'Direct Imaging', 
      'Microlensing', 
      'Timing Variations'
    ];
    
    const planetTypes = [
      'Gas Giant', 
      'Neptune-like', 
      'Super-Earth', 
      'Terrestrial', 
      'Mini-Neptune'
    ];
    
    const data = [];
    const totalPlanets = timeRange === 'all' ? 5000 :
                         timeRange === 'century' ? 3000 :
                         timeRange === 'decade' ? 1500 : 500;
    
    // Generate planets with realistic distributions
    for (let i = 0; i < totalPlanets; i++) {
      // Year of discovery
      let year;
      if (timeRange === 'all') {
        // First exoplanet discoveries in 1990s, most after 2010
        year = Math.floor(1995 + Math.pow(Math.random(), 0.5) * 30);
      } else if (timeRange === 'century') {
        year = Math.floor(1995 + Math.pow(Math.random(), 0.5) * 30);
      } else if (timeRange === 'decade') {
        year = Math.floor(2015 + Math.random() * 10);
      } else {
        year = Math.floor(2024 + Math.random() * 1);
      }
      
      // Detection method (transit and radial velocity most common)
      const methodProbs = [0.6, 0.3, 0.05, 0.03, 0.02];
      const methodIndex = weightedRandomIndex(methodProbs);
      const method = detectionMethods[methodIndex];
      
      // Planet type (gas giants easier to detect historically)
      let typeProbs;
      if (year < 2010) {
        typeProbs = [0.7, 0.2, 0.05, 0.03, 0.02]; // Mostly gas giants in early discoveries
      } else if (year < 2020) {
        typeProbs = [0.4, 0.3, 0.15, 0.05, 0.1]; // More diversity as technology improved
      } else {
        typeProbs = [0.2, 0.25, 0.25, 0.15, 0.15]; // Better at finding smaller planets now
      }
      const typeIndex = weightedRandomIndex(typeProbs);
      const type = planetTypes[typeIndex];
      
      // Planet size (Earth radii)
      let radius;
      switch (type) {
        case 'Gas Giant':
          radius = 5 + Math.random() * 10; // 5-15 Earth radii
          break;
        case 'Neptune-like':
          radius = 3 + Math.random() * 2; // 3-5 Earth radii
          break;
        case 'Super-Earth':
          radius = 1.2 + Math.random() * 1.8; // 1.2-3 Earth radii
          break;
        case 'Terrestrial':
          radius = 0.5 + Math.random() * 0.7; // 0.5-1.2 Earth radii
          break;
        case 'Mini-Neptune':
          radius = 2 + Math.random() * 1; // 2-3 Earth radii
          break;
        default:
          radius = 1;
      }
      
      // Orbital period (days)
      let period;
      if (type === 'Gas Giant' && Math.random() > 0.7) {
        // Some hot Jupiters with very short periods
        period = 1 + Math.random() * 10;
      } else {
        // Log-normal distribution of periods
        period = Math.exp(Math.random() * 7); // from ~1 day to ~1000 days
      }
      period = Math.round(period * 10) / 10; // Round to 1 decimal place
      
      // Distance from Earth (light years)
      const distance = Math.round(10 + Math.random() * 990); // 10-1000 light years
      
      // Habitable zone flag (only for certain planet types and orbital periods)
      const habitable = (type === 'Terrestrial' || type === 'Super-Earth') && 
                       period > 180 && period < 500 && 
                       Math.random() > 0.7;
      
      data.push({
        id: `planet-${i}`,
        name: `Exoplanet-${i+1}`,
        year: year,
        method: method,
        type: type,
        radius: radius,
        period: period,
        distance: distance,
        habitable: habitable,
        color: habitable ? '#4ade80' : // Green for habitable
               type === 'Gas Giant' ? '#60a5fa' : // Blue
               type === 'Neptune-like' ? '#818cf8' : // Indigo
               type === 'Super-Earth' ? '#fb923c' : // Orange
               type === 'Terrestrial' ? '#f87171' : // Red
               '#a78bfa', // Purple for Mini-Neptune
        description: `A ${type.toLowerCase()} exoplanet discovered in ${year} using the ${method.toLowerCase()} method. It has a radius of ${radius.toFixed(1)} Earth radii and orbits its star every ${period.toFixed(1)} days at a distance of ${distance} light years from Earth.${habitable ? ' This planet is in the habitable zone of its star.' : ''}`
      });
    }
    
    return {
      type: 'planets',
      items: data,
      title: 'Exoplanet Data',
      subtitle: 'Known exoplanets by size, orbital period, and detection method'
    };
  };
  
  // Generate galaxy data
  const generateGalaxyData = (timeRange) => {
    const galaxyTypes = [
      'Spiral', 
      'Elliptical', 
      'Lenticular', 
      'Irregular', 
      'Peculiar'
    ];
    
    const data = [];
    const totalGalaxies = timeRange === 'all' ? 300 :
                          timeRange === 'century' ? 200 :
                          timeRange === 'decade' ? 100 : 50;
    
    // Type distribution (spirals and ellipticals most common)
    const typeDistribution = [0.6, 0.3, 0.05, 0.03, 0.02];
    
    for (let i = 0; i < totalGalaxies; i++) {
      const typeIndex = weightedRandomIndex(typeDistribution);
      const type = galaxyTypes[typeIndex];
      
      // Distance in megaparsecs (Mpc)
      const distance = Math.round((10 + Math.pow(Math.random(), 2) * 990) * 10) / 10;
      
      // Redshift (z) - roughly correlated with distance
      const redshift = (distance / 1000) * (0.8 + Math.random() * 0.4);
      
      // Size in kiloparsecs (kpc)
      let size;
      switch (type) {
        case 'Spiral':
          size = 10 + Math.random() * 40; // 10-50 kpc
          break;
        case 'Elliptical':
          size = 5 + Math.random() * 195; // 5-200 kpc (can be very large)
          break;
        case 'Lenticular':
          size = 15 + Math.random() * 35; // 15-50 kpc
          break;
        case 'Irregular':
          size = 3 + Math.random() * 12; // 3-15 kpc
          break;
        case 'Peculiar':
          size = 5 + Math.random() * 45; // 5-50 kpc
          break;
        default:
          size = 20;
      }
      
      // Mass in solar masses (log scale)
      const logMass = 9 + Math.random() * 3; // 10^9 to 10^12 solar masses
      const mass = Math.pow(10, logMass);
      
      // Star formation rate (SFR) in solar masses per year
      let sfr;
      switch (type) {
        case 'Spiral':
          sfr = 1 + Math.random() * 9; // 1-10 solar masses/year
          break;
        case 'Elliptical':
          sfr = 0.01 + Math.random() * 0.99; // 0.01-1 solar masses/year (low)
          break;
        case 'Lenticular':
          sfr = 0.1 + Math.random() * 1.9; // 0.1-2 solar masses/year
          break;
        case 'Irregular':
          sfr = 0.5 + Math.random() * 4.5; // 0.5-5 solar masses/year
          break;
        case 'Peculiar':
          sfr = 5 + Math.random() * 45; // 5-50 solar masses/year (can be high due to mergers)
          break;
        default:
          sfr = 1;
      }
      
      data.push({
        id: `galaxy-${i}`,
        name: `Galaxy-${i+1}`,
        type: type,
        distance: distance,
        redshift: redshift.toFixed(3),
        size: Math.round(size),
        mass: mass.toExponential(2),
        starFormationRate: sfr.toFixed(2),
        color: type === 'Spiral' ? '#60a5fa' : // Blue
               type === 'Elliptical' ? '#f59e0b' : // Amber
               type === 'Lenticular' ? '#a78bfa' : // Purple
               type === 'Irregular' ? '#f87171' : // Red
               '#ec4899', // Pink for Peculiar
        description: `A ${type.toLowerCase()} galaxy located ${distance} Mpc away with a redshift of ${redshift.toFixed(3)}. It has a diameter of approximately ${Math.round(size)} kpc, a mass of ${mass.toExponential(2)} solar masses, and a star formation rate of ${sfr.toFixed(2)} solar masses per year.`
      });
    }
    
    return {
      type: 'galaxies',
      items: data,
      title: 'Galaxy Types',
      subtitle: 'Distribution of galaxy morphologies and properties'
    };
  };
  
  // Generate astronomical discovery timeline data
  const generateDiscoveryData = (timeRange) => {
    // Define significant astronomical discoveries and missions
    const allDiscoveries = [
      { year: 1610, name: "Galileo observes Jupiter's moons", category: "Observation", significance: 9 },
      { year: 1687, name: "Newton's laws of motion and gravity", category: "Theory", significance: 10 },
      { year: 1781, name: "Discovery of Uranus", category: "Planet", significance: 8 },
      { year: 1801, name: "Discovery of Ceres", category: "Asteroid", significance: 6 },
      { year: 1846, name: "Discovery of Neptune", category: "Planet", significance: 8 },
      { year: 1905, name: "Einstein's Special Relativity", category: "Theory", significance: 10 },
      { year: 1915, name: "Einstein's General Relativity", category: "Theory", significance: 10 },
      { year: 1923, name: "Galaxies beyond the Milky Way confirmed", category: "Observation", significance: 9 },
      { year: 1929, name: "Hubble discovers expanding universe", category: "Observation", significance: 10 },
      { year: 1930, name: "Discovery of Pluto", category: "Dwarf Planet", significance: 7 },
      { year: 1957, name: "Sputnik 1 - First artificial satellite", category: "Mission", significance: 9 },
      { year: 1961, name: "First human in space (Yuri Gagarin)", category: "Mission", significance: 9 },
      { year: 1969, name: "Apollo 11 Moon landing", category: "Mission", significance: 10 },
      { year: 1977, name: "Voyager missions launch", category: "Mission", significance: 8 },
      { year: 1990, name: "Hubble Space Telescope launch", category: "Mission", significance: 9 },
      { year: 1992, name: "First exoplanets discovered", category: "Exoplanet", significance: 8 },
      { year: 1995, name: "First exoplanet around Sun-like star", category: "Exoplanet", significance: 8 },
      { year: 1998, name: "Discovery of accelerating universe expansion", category: "Observation", significance: 10 },
      { year: 2003, name: "WMAP maps cosmic microwave background", category: "Observation", significance: 8 },
      { year: 2004, name: "Cassini arrives at Saturn", category: "Mission", significance: 7 },
      { year: 2005, name: "Huygens lands on Titan", category: "Mission", significance: 8 },
      { year: 2006, name: "Pluto reclassified as dwarf planet", category: "Classification", significance: 6 },
      { year: 2009, name: "Kepler mission launches", category: "Mission", significance: 8 },
      { year: 2012, name: "Curiosity rover lands on Mars", category: "Mission", significance: 8 },
      { year: 2015, name: "New Horizons reaches Pluto", category: "Mission", significance: 7 },
      { year: 2016, name: "Gravitational waves directly detected", category: "Observation", significance: 10 },
      { year: 2017, name: "TRAPPIST-1 system with 7 Earth-sized planets", category: "Exoplanet", significance: 8 },
      { year: 2019, name: "First image of a black hole", category: "Observation", significance: 9 },
      { year: 2020, name: "SpaceX first crewed mission", category: "Mission", significance: 8 },
      { year: 2021, name: "James Webb Space Telescope launch", category: "Mission", significance: 9 },
      { year: 2022, name: "First JWST deep field images", category: "Observation", significance: 8 },
      { year: 2023, name: "Chandrayaan-3 lands on lunar south pole", category: "Mission", significance: 7 },
      { year: 2024, name: "Europa Clipper launch", category: "Mission", significance: 7 },
      { year: 2025, name: "Nancy Grace Roman Space Telescope launch", category: "Mission", significance: 8 }
    ];
    
    // Filter based on time range
    let filteredDiscoveries;
    const currentYear = 2025;
    
    switch (timeRange) {
      case 'all':
        filteredDiscoveries = allDiscoveries;
        break;
      case 'century':
        filteredDiscoveries = allDiscoveries.filter(d => d.year > currentYear - 100);
        break;
      case 'decade':
        filteredDiscoveries = allDiscoveries.filter(d => d.year > currentYear - 10);
        break;
      case 'year':
        filteredDiscoveries = allDiscoveries.filter(d => d.year > currentYear - 1);
        break;
      default:
        filteredDiscoveries = allDiscoveries;
    }
    
    // Add additional properties for visualization
    const discoveries = filteredDiscoveries.map((d, i) => ({
      ...d,
      id: `discovery-${i}`,
      color: d.category === 'Mission' ? '#60a5fa' : // Blue
             d.category === 'Observation' ? '#a78bfa' : // Purple
             d.category === 'Theory' ? '#f59e0b' : // Amber
             d.category === 'Exoplanet' ? '#4ade80' : // Green
             d.category === 'Planet' ? '#f87171' : // Red
             d.category === 'Dwarf Planet' ? '#fb923c' : // Orange
             d.category === 'Asteroid' ? '#94a3b8' : // Slate
             d.category === 'Classification' ? '#ec4899' : // Pink
             '#64748b', // Gray for others
      description: `${d.name} (${d.year}): A significant ${d.category.toLowerCase()} event in astronomy with a historical significance rating of ${d.significance}/10.`
    }));
    
    return {
      type: 'discoveries',
      items: discoveries,
      title: 'Astronomical Discoveries',
      subtitle: 'Timeline of major astronomical discoveries and missions'
    };
  };
  
  // Helper function for weighted random selection
  const weightedRandomIndex = (weights) => {
    const sum = weights.reduce((a, b) => a + b, 0);
    const normalized = weights.map(w => w / sum);
    
    const random = Math.random();
    let cumulativeProb = 0;
    
    for (let i = 0; i < normalized.length; i++) {
      cumulativeProb += normalized[i];
      if (random < cumulativeProb) {
        return i;
      }
    }
    
    return normalized.length - 1; // Fallback
  };
  
  // Get description for star types
  const getStarDescription = (type, lumClass) => {
    const spectralDescriptions = {
      'O': 'Very hot, massive, and bright blue stars with surface temperatures over 30,000K.',
      'B': 'Hot, blue-white stars with surface temperatures between 10,000-30,000K.',
      'A': 'White or blue-white stars with surface temperatures between 7,500-10,000K.',
      'F': 'Yellow-white stars with surface temperatures between 6,000-7,500K.',
      'G': 'Yellow stars (like our Sun) with surface temperatures between 5,200-6,000K.',
      'K': 'Orange stars with surface temperatures between 3,700-5,200K.',
      'M': 'Red stars with surface temperatures between 2,400-3,700K.'
    };
    
    const luminosityDescriptions = {
      'I': 'Supergiant stars - extremely luminous and massive.',
      'II': 'Bright giant stars - less luminous than supergiants.',
      'III': 'Normal giant stars - much larger than main sequence stars.',
      'IV': 'Subgiant stars - intermediate between giants and main sequence.',
      'V': 'Main sequence stars (dwarf stars) - like our Sun.'
    };
    
    return `${spectralDescriptions[type]} This is a ${luminosityDescriptions[lumClass]}`;
  };
  
  // Render charts based on dataset type
  const renderCharts = () => {
    if (!chartContainerRef.current || !data) return;
    
    // Clear previous charts
    d3.select(chartContainerRef.current).selectAll('*').remove();
    
    const container = chartContainerRef.current;
    const width = container.clientWidth;
    const height = 500;
    
    switch (data.type) {
      case 'stars':
        renderStarChart(container, width, height);
        break;
      case 'planets':
        renderPlanetChart(container, width, height);
        break;
      case 'galaxies':
        renderGalaxyChart(container, width, height);
        break;
      case 'discoveries':
        renderDiscoveryTimeline(container, width, height);
        break;
      default:
        // Fallback
        renderGenericChart(container, width, height);
    }
  };
  
  // Render star classification chart
  const renderStarChart = (container, width, height) => {
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Background
    svg.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', darkMode ? '#111827' : '#f8fafc')
      .attr('rx', 8);
    
    // Scales
    const xScale = d3.scaleBand()
      .domain(['O', 'B', 'A', 'F', 'G', 'K', 'M'])
      .range([0, innerWidth])
      .padding(0.2);
    
    const yScale = d3.scaleBand()
      .domain(['I', 'II', 'III', 'IV', 'V'])
      .range([0, innerHeight])
      .padding(0.2);
    
    const sizeScale = d3.scaleLinear()
      .domain([0, d3.max(data.items, d => d.count)])
      .range([5, 50]);
    
    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px');
    
    svg.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px');
    
    // Axis labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .text('Spectral Type');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .text('Luminosity Class');
    
    // Grid lines
    svg.selectAll('xGrid')
      .data(xScale.domain())
      .enter()
      .append('line')
      .attr('x1', d => xScale(d) + xScale.bandwidth() / 2)
      .attr('x2', d => xScale(d) + xScale.bandwidth() / 2)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', darkMode ? '#1f2937' : '#e2e8f0')
      .attr('stroke-width', 1);
    
    svg.selectAll('yGrid')
      .data(yScale.domain())
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d) + yScale.bandwidth() / 2)
      .attr('y2', d => yScale(d) + yScale.bandwidth() / 2)
      .attr('stroke', darkMode ? '#1f2937' : '#e2e8f0')
      .attr('stroke-width', 1);
    
    // Circles for star types
    const circles = svg.selectAll('circle')
      .data(data.items)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.spectralType) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.luminosityClass) + yScale.bandwidth() / 2)
      .attr('r', d => Math.sqrt(sizeScale(d.count)))
      .attr('fill', d => d.color)
      .attr('stroke', darkMode ? '#e2e8f0' : '#334155')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('opacity', 1);
        
        setSelectedItem(d);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.8);
        
        setSelectedItem(null);
      });
    
    // Add labels for major star types
    svg.selectAll('starLabels')
      .data(data.items.filter(d => d.count > 500))
      .enter()
      .append('text')
      .attr('x', d => xScale(d.spectralType) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.luminosityClass) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', '#000')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(d => `${d.spectralType}${d.luminosityClass}`);
    
    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Hertzsprung-Russell Diagram');
  };
  
  // Render exoplanet chart
  const renderPlanetChart = (container, width, height) => {
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Background
    svg.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', darkMode ? '#111827' : '#f8fafc')
      .attr('rx', 8);
    
    // Scales
    const xScale = d3.scaleLog()
      .domain([0.5, d3.max(data.items, d => d.period) * 1.1])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data.items, d => d.radius) * 1.1])
      .range([innerHeight, 0]);
    
    const sizeScale = d3.scaleLinear()
      .domain([d3.min(data.items, d => d.radius), d3.max(data.items, d => d.radius)])
      .range([3, 15]);
    
    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => d.toFixed(0));
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5);
    
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px');
    
    svg.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px');
    
    // Axis labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .text('Orbital Period (days, log scale)');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .text('Planet Radius (Earth radii)');
    
    // Reference lines
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(1))
      .attr('y2', yScale(1))
      .attr('stroke', darkMode ? '#475569' : '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');
    
    svg.append('text')
      .attr('x', 5)
      .attr('y', yScale(1) - 5)
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '10px')
      .text('Earth size');
    
    // Habitable zone (simplified)
    svg.append('rect')
      .attr('x', xScale(180))
      .attr('y', 0)
      .attr('width', xScale(500) - xScale(180))
      .attr('height', innerHeight)
      .attr('fill', '#4ade80')
      .attr('opacity', 0.1);
    
    svg.append('text')
      .attr('x', xScale(300))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '10px')
      .text('Habitable Zone');
    
    // Circles for planets
    const circles = svg.selectAll('circle')
      .data(data.items)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(Math.max(0.5, d.period)))
      .attr('cy', d => yScale(d.radius))
      .attr('r', d => sizeScale(d.radius))
      .attr('fill', d => d.color)
      .attr('stroke', d => d.habitable ? '#4ade80' : (darkMode ? '#e2e8f0' : '#334155'))
      .attr('stroke-width', d => d.habitable ? 2 : 0.5)
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', d.habitable ? 3 : 2)
          .attr('opacity', 1);
        
        setSelectedItem(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('stroke-width', d.habitable ? 2 : 0.5)
          .attr('opacity', 0.7);
        
        setSelectedItem(null);
      });
    
    // Legend for planet types
    const planetTypes = ['Gas Giant', 'Neptune-like', 'Super-Earth', 'Terrestrial', 'Mini-Neptune'];
    const colors = ['#60a5fa', '#818cf8', '#fb923c', '#f87171', '#a78bfa'];
    
    const legend = svg.append('g')
      .attr('transform', `translate(${innerWidth - 150}, 20)`);
    
    planetTypes.forEach((type, i) => {
      legend.append('circle')
        .attr('cx', 10)
        .attr('cy', i * 20)
        .attr('r', 6)
        .attr('fill', colors[i]);
      
      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 4)
        .style('fill', darkMode ? '#e2e8f0' : '#334155')
        .style('font-size', '12px')
        .text(type);
    });
    
    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Exoplanet Size vs. Orbital Period');
  };
  
  // Render galaxy chart
  const renderGalaxyChart = (container, width, height) => {
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Background
    svg.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', darkMode ? '#111827' : '#f8fafc')
      .attr('rx', 8);
    
    // Scales
    const xScale = d3.scaleLog()
      .domain([1, d3.max(data.items, d => parseFloat(d.distance)) * 1.1])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLog()
      .domain([1, d3.max(data.items, d => parseFloat(d.size)) * 1.1])
      .range([innerHeight, 0]);
    
    const sizeScale = d3.scaleSqrt()
      .domain([d3.min(data.items, d => parseFloat(d.starFormationRate)), 
               d3.max(data.items, d => parseFloat(d.starFormationRate))])
      .range([3, 15]);
    
    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => d.toFixed(0));
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => d.toFixed(0));
    
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px');
    
    svg.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px');
    
    // Axis labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .text('Distance (Mpc, log scale)');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .text('Size (kpc, log scale)');
    
    // Circles for galaxies
    const circles = svg.selectAll('circle')
      .data(data.items)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(Math.max(1, parseFloat(d.distance))))
      .attr('cy', d => yScale(Math.max(1, parseFloat(d.size))))
      .attr('r', d => sizeScale(parseFloat(d.starFormationRate)))
      .attr('fill', d => d.color)
      .attr('stroke', darkMode ? '#e2e8f0' : '#334155')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('opacity', 1);
        
        setSelectedItem(d);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.7);
        
        setSelectedItem(null);
      });
    
    // Legend for galaxy types
    const galaxyTypes = ['Spiral', 'Elliptical', 'Lenticular', 'Irregular', 'Peculiar'];
    const colors = ['#60a5fa', '#f59e0b', '#a78bfa', '#f87171', '#ec4899'];
    
    const legend = svg.append('g')
      .attr('transform', `translate(${innerWidth - 150}, 20)`);
    
    galaxyTypes.forEach((type, i) => {
      legend.append('circle')
        .attr('cx', 10)
        .attr('cy', i * 20)
        .attr('r', 6)
        .attr('fill', colors[i]);
      
      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 4)
        .style('fill', darkMode ? '#e2e8f0' : '#334155')
        .style('font-size', '12px')
        .text(type);
    });
    
    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Galaxy Size vs. Distance');
  };
  
  // Render discovery timeline
  const renderDiscoveryTimeline = (container, width, height) => {
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Background
    svg.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', darkMode ? '#111827' : '#f8fafc')
      .attr('rx', 8);
    
    // Sort data chronologically
    const sortedData = [...data.items].sort((a, b) => a.year - b.year);
    
    // Scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(sortedData, d => d.year), d3.max(sortedData, d => d.year)])
      .range([0, innerWidth]);
    
    const yScale = d3.scalePoint()
      .domain([...new Set(sortedData.map(d => d.category))])
      .range([0, innerHeight])
      .padding(0.5);
    
    const sizeScale = d3.scaleLinear()
      .domain([d3.min(sortedData, d => d.significance), d3.max(sortedData, d => d.significance)])
      .range([5, 15]);
    
    // Axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => d);
    
    const yAxis = d3.axisLeft(yScale);
    
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px');
    
    svg.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px');
    
    // Axis labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .text('Year');
    
    // Grid lines
    svg.selectAll('yGrid')
      .data(yScale.domain())
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', darkMode ? '#1f2937' : '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');
    
    // Circles for discoveries
    const circles = svg.selectAll('circle')
      .data(sortedData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.category))
      .attr('r', d => sizeScale(d.significance))
      .attr('fill', d => d.color)
      .attr('stroke', darkMode ? '#e2e8f0' : '#334155')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('opacity', 1);
        
        setSelectedItem(d);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.8);
        
        setSelectedItem(null);
      });
    
    // Labels for significant discoveries
    svg.selectAll('discoveryLabels')
      .data(sortedData.filter(d => d.significance >= 9))
      .enter()
      .append('text')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.category) - sizeScale(d.significance) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '10px')
      .text(d => d.year);
    
    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Astronomical Discoveries Timeline');
  };
  
  // Render generic chart (fallback)
  const renderGenericChart = (container, width, height) => {
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .text('No visualization available for this dataset');
  };
  
  // Render galaxy map
  const renderGalaxyMap = () => {
    if (!galaxyMapRef.current || !data) return;
    
    // Clear previous content
    d3.select(galaxyMapRef.current).selectAll('*').remove();
    
    const container = galaxyMapRef.current;
    const width = container.clientWidth;
    const height = 500;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', darkMode ? '#0f172a' : '#f1f5f9')
      .attr('rx', 8);
    
    // Create starfield background
    const starCount = 500;
    const stars = [];
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    
    svg.selectAll('starfield')
      .data(stars)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', '#ffffff')
      .attr('opacity', d => d.opacity);
    
    // Different visualization based on dataset type
    switch (data.type) {
      case 'stars':
        renderStarGalaxyMap(svg, width, height);
        break;
      case 'planets':
        renderPlanetGalaxyMap(svg, width, height);
        break;
      case 'galaxies':
        renderGalaxyDistributionMap(svg, width, height);
        break;
      case 'discoveries':
        renderDiscoveryGalaxyMap(svg, width, height);
        break;
      default:
        // Fallback
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .style('fill', darkMode ? '#e2e8f0' : '#334155')
          .text('No galaxy map available for this dataset');
    }
  };
  
  // Render star galaxy map
  const renderStarGalaxyMap = (svg, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create spiral galaxy structure
    const arms = 5;
    const points = [];
    
    // Generate spiral arms
    for (let arm = 0; arm < arms; arm++) {
      const armOffset = (arm / arms) * Math.PI * 2;
      
      for (let i = 0; i < 100; i++) {
        const distance = 20 + i * 1.5;
        const angle = armOffset + (i / 30) * Math.PI * 2;
        
        // Add some randomness to make it look more natural
        const randomOffset = (Math.random() - 0.5) * 20;
        const x = centerX + Math.cos(angle) * distance + randomOffset;
        const y = centerY + Math.sin(angle) * distance + randomOffset;
        
        points.push({ x, y });
      }
    }
    
    // Draw galaxy core
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 40)
      .attr('fill', 'url(#coreGradient)');
    
    // Create core gradient
    const coreGradient = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'coreGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    coreGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fff4ea')
      .attr('stop-opacity', 1);
    
    coreGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#fff4ea')
      .attr('stop-opacity', 0);
    
    // Map star data to galaxy
    const stars = data.items.map((d, i) => {
      // Use spectral type to determine position in galaxy
      // O and B stars in spiral arms, K and M stars more evenly distributed
      let x, y;
      
      if (d.spectralType === 'O' || d.spectralType === 'B') {
        // Young, hot stars in spiral arms
        const pointIndex = Math.floor(Math.random() * points.length);
        x = points[pointIndex].x;
        y = points[pointIndex].y;
      } else if (d.spectralType === 'A' || d.spectralType === 'F') {
        // Intermediate stars, somewhat in arms
        if (Math.random() > 0.3) {
          const pointIndex = Math.floor(Math.random() * points.length);
          x = points[pointIndex].x;
          y = points[pointIndex].y;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const distance = 20 + Math.random() * 180;
          x = centerX + Math.cos(angle) * distance;
          y = centerY + Math.sin(angle) * distance;
        }
      } else {
        // Older stars more evenly distributed
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 180;
        x = centerX + Math.cos(angle) * distance;
        y = centerY + Math.sin(angle) * distance;
      }
      
      return {
        ...d,
        x,
        y,
        displayRadius: Math.sqrt(d.count) * 0.05 + 1
      };
    });
    
    // Draw stars
    svg.selectAll('galaxyStars')
      .data(stars)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.displayRadius)
      .attr('fill', d => d.color)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', d => d.displayRadius * 1.5)
          .attr('opacity', 1);
        
        setSelectedItem(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('r', d => d.displayRadius)
          .attr('opacity', 0.8);
        
        setSelectedItem(null);
      });
    
    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Stellar Distribution in Galaxy');
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(20, 20)`);
    
    const spectralTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
    const colors = ['#9bb0ff', '#aabfff', '#cad7ff', '#f8f7ff', '#fff4ea', '#ffd2a1', '#ffcc6f'];
    
    spectralTypes.forEach((type, i) => {
      legend.append('circle')
        .attr('cx', 10)
        .attr('cy', i * 20 + 40)
        .attr('r', 6)
        .attr('fill', colors[i]);
      
      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 44)
        .style('fill', darkMode ? '#e2e8f0' : '#334155')
        .style('font-size', '12px')
        .text(`Type ${type}`);
    });
  };
  
  // Render planet galaxy map
  const renderPlanetGalaxyMap = (svg, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create star
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 20)
      .attr('fill', 'url(#starGradient)');
    
    // Create star gradient
    const starGradient = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'starGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    starGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fff4ea')
      .attr('stop-opacity', 1);
    
    starGradient.append('stop')
      .attr('offset', '70%')
      .attr('stop-color', '#ffd2a1')
      .attr('stop-opacity', 0.8);
    
    starGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ffd2a1')
      .attr('stop-opacity', 0);
    
    // Draw habitable zone
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 120)
      .attr('fill', 'none')
      .attr('stroke', '#4ade80')
      .attr('stroke-width', 15)
      .attr('stroke-opacity', 0.2);
    
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 120 - 10)
      .attr('text-anchor', 'middle')
      .style('fill', '#4ade80')
      .style('font-size', '12px')
      .text('Habitable Zone');
    
    // Draw orbital paths
    const orbitalPaths = [40, 70, 120, 180, 230];
    
    orbitalPaths.forEach(radius => {
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', darkMode ? '#1f2937' : '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
    });
    
    // Filter planets to a reasonable number for display
    const displayPlanets = data.items
      .sort((a, b) => b.radius - a.radius)
      .slice(0, 50);
    
    // Map planets to orbital positions
    const planets = displayPlanets.map(d => {
      // Use period to determine orbital radius (log scale)
      const orbitalRadius = 30 + Math.log(d.period) * 30;
      
      // Random position on orbit
      const angle = Math.random() * Math.PI * 2;
      const x = centerX + Math.cos(angle) * orbitalRadius;
      const y = centerY + Math.sin(angle) * orbitalRadius;
      
      return {
        ...d,
        x,
        y,
        orbitalRadius,
        displayRadius: d.radius * 0.8 + 2
      };
    });
    
    // Draw planets
    svg.selectAll('planets')
      .data(planets)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.displayRadius)
      .attr('fill', d => d.color)
      .attr('stroke', d => d.habitable ? '#4ade80' : (darkMode ? '#e2e8f0' : '#334155'))
      .attr('stroke-width', d => d.habitable ? 2 : 0.5)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', d => d.displayRadius * 1.5)
          .attr('opacity', 1);
        
        setSelectedItem(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('r', d => d.displayRadius)
          .attr('opacity', 0.8);
        
        setSelectedItem(null);
      });
    
    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Exoplanet System Visualization');
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(20, 20)`);
    
    const planetTypes = ['Gas Giant', 'Neptune-like', 'Super-Earth', 'Terrestrial', 'Mini-Neptune'];
    const colors = ['#60a5fa', '#818cf8', '#fb923c', '#f87171', '#a78bfa'];
    
    planetTypes.forEach((type, i) => {
      legend.append('circle')
        .attr('cx', 10)
        .attr('cy', i * 20 + 40)
        .attr('r', 6)
        .attr('fill', colors[i]);
      
      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 44)
        .style('fill', darkMode ? '#e2e8f0' : '#334155')
        .style('font-size', '12px')
        .text(type);
    });
  };
  
  // Render galaxy distribution map
  const renderGalaxyDistributionMap = (svg, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create 3D-like distribution of galaxies
    const galaxies = data.items.map(d => {
      // Use distance to determine position (log scale)
      const distance = Math.log(parseFloat(d.distance)) * 20;
      
      // Random position in 3D space
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(2 * Math.random() - 1);
      
      const x = centerX + distance * Math.sin(theta) * Math.cos(phi);
      const y = centerY + distance * Math.sin(theta) * Math.sin(phi);
      
      // Use z for size scaling (perspective effect)
      const z = distance * Math.cos(theta);
      const scaleFactor = 1 - (z / 200); // Perspective scaling
      
      return {
        ...d,
        x,
        y,
        z,
        displayRadius: Math.sqrt(parseFloat(d.size)) * 0.3 * Math.max(0.2, scaleFactor)
      };
    });
    
    // Sort by z to handle overlapping (paint furthest first)
    galaxies.sort((a, b) => b.z - a.z);
    
    // Draw distance rings
    const rings = [50, 100, 150];
    
    rings.forEach(radius => {
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', darkMode ? '#1f2937' : '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
      
      svg.append('text')
        .attr('x', centerX + radius)
        .attr('y', centerY - 5)
        .attr('text-anchor', 'middle')
        .style('fill', darkMode ? '#64748b' : '#94a3b8')
        .style('font-size', '10px')
        .text(`${Math.round(Math.exp(radius/20))} Mpc`);
    });
    
    // Draw galaxies
    svg.selectAll('galaxies')
      .data(galaxies)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.displayRadius)
      .attr('fill', d => d.color)
      .attr('opacity', d => 0.2 + 0.8 * (1 - d.z / 200))
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', d => d.displayRadius * 1.5)
          .attr('opacity', d => 0.5 + 0.5 * (1 - d.z / 200));
        
        setSelectedItem(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('r', d => d.displayRadius)
          .attr('opacity', d => 0.2 + 0.8 * (1 - d.z / 200));
        
        setSelectedItem(null);
      });
    
    // Draw Milky Way at center
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 8)
      .attr('fill', '#f59e0b')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);
    
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 15)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '12px')
      .text('Milky Way');
    
    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Galaxy Distribution Map');
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(20, 20)`);
    
    const galaxyTypes = ['Spiral', 'Elliptical', 'Lenticular', 'Irregular', 'Peculiar'];
    const colors = ['#60a5fa', '#f59e0b', '#a78bfa', '#f87171', '#ec4899'];
    
    galaxyTypes.forEach((type, i) => {
      legend.append('circle')
        .attr('cx', 10)
        .attr('cy', i * 20 + 40)
        .attr('r', 6)
        .attr('fill', colors[i]);
      
      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 44)
        .style('fill', darkMode ? '#e2e8f0' : '#334155')
        .style('font-size', '12px')
        .text(type);
    });
  };
  
  // Render discovery galaxy map
  const renderDiscoveryGalaxyMap = (svg, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create timeline spiral
    const points = [];
    const minYear = d3.min(data.items, d => d.year);
    const maxYear = d3.max(data.items, d => d.year);
    const yearRange = maxYear - minYear;
    
    // Generate spiral points
    for (let i = 0; i <= yearRange; i++) {
      const year = minYear + i;
      const angle = (i / yearRange) * Math.PI * 10;
      const distance = 30 + (i / yearRange) * 170;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      points.push({ year, x, y, angle, distance });
    }
    
    // Draw spiral path
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCardinal);
    
    svg.append('path')
      .attr('d', lineGenerator(points))
      .attr('fill', 'none')
      .attr('stroke', darkMode ? '#1f2937' : '#e2e8f0')
      .attr('stroke-width', 2);
    
    // Add year labels along spiral
    const labelYears = [];
    const yearStep = Math.ceil(yearRange / 10);
    
    for (let year = minYear; year <= maxYear; year += yearStep) {
      labelYears.push(year);
    }
    
    labelYears.forEach(year => {
      const point = points.find(p => p.year === year) || 
                   points.reduce((prev, curr) => 
                     Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev
                   );
      
      // Position label slightly outside spiral
      const labelAngle = point.angle;
      const labelDistance = point.distance + 10;
      const labelX = centerX + Math.cos(labelAngle) * labelDistance;
      const labelY = centerY + Math.sin(labelAngle) * labelDistance;
      
      svg.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .style('fill', darkMode ? '#64748b' : '#94a3b8')
        .style('font-size', '10px')
        .text(year);
    });
    
    // Map discoveries to spiral
    const discoveries = data.items.map(d => {
      // Find closest point on spiral for this year
      const point = points.find(p => p.year === d.year) || 
                   points.reduce((prev, curr) => 
                     Math.abs(curr.year - d.year) < Math.abs(prev.year - d.year) ? curr : prev
                   );
      
      return {
        ...d,
        x: point.x,
        y: point.y,
        displayRadius: d.significance * 0.8
      };
    });
    
    // Draw discoveries
    svg.selectAll('discoveries')
      .data(discoveries)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.displayRadius)
      .attr('fill', d => d.color)
      .attr('stroke', darkMode ? '#e2e8f0' : '#334155')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', d => d.displayRadius * 1.2)
          .attr('opacity', 1);
        
        setSelectedItem(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('r', d => d.displayRadius)
          .attr('opacity', 0.8);
        
        setSelectedItem(null);
      });
    
    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', darkMode ? '#e2e8f0' : '#334155')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Astronomical Discoveries Timeline Spiral');
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(20, 20)`);
    
    const categories = ['Mission', 'Observation', 'Theory', 'Exoplanet', 'Planet'];
    const colors = ['#60a5fa', '#a78bfa', '#f59e0b', '#4ade80', '#f87171'];
    
    categories.forEach((category, i) => {
      legend.append('circle')
        .attr('cx', 10)
        .attr('cy', i * 20 + 40)
        .attr('r', 6)
        .attr('fill', colors[i]);
      
      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 44)
        .style('fill', darkMode ? '#e2e8f0' : '#334155')
        .style('font-size', '12px')
        .text(category);
    });
  };
  
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            className="w-16 h-16 rounded-full border-4 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', borderTopColor: 'transparent' }}
          />
        </div>
      ) : (
        <>
          {/* Visualization Container */}
          <div className="relative">
            {viewMode === 'charts' ? (
              <div ref={chartContainerRef} className="w-full h-[500px]"></div>
            ) : (
              <div ref={galaxyMapRef} className="w-full h-[500px]"></div>
            )}
            
            {/* Selected Item Info */}
            {selectedItem && (
              <motion.div 
                className={`absolute bottom-4 right-4 p-4 rounded-lg ${darkMode ? 'bg-deep-blue/80 backdrop-blur-sm border border-cosmic-purple/30' : 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg'} max-w-xs`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className={`text-lg font-display font-bold ${darkMode ? 'text-electric-blue' : 'text-cosmic-purple'}`}>
                  {selectedItem.name || `${selectedItem.spectralType || ''}${selectedItem.luminosityClass || ''}`}
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedItem.description}
                </p>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCharts;
