const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;

async function getFirstBingImageUrl(searchQuery, tags = []) {
  try {
    // Build enhanced search query using tags
    let enhancedQuery = searchQuery;
    
    // Add tag-specific search terms
    if (tags.includes('Furniture/Appliances')) {
      enhancedQuery += ' furniture';
    }
    if (tags.includes('Computer')) {
      enhancedQuery += ' computer hardware';
    }
    if (tags.includes('Scientific')) {
      enhancedQuery += ' laboratory equipment';
    }
    if (tags.includes('AV')) {
      enhancedQuery += ' audio visual equipment';
    }
    if (tags.includes('Office')) {
      enhancedQuery += ' office equipment';
    }
    if (tags.includes('Monitor/TV')) {
      enhancedQuery += ' display screen';
    }
    if (tags.includes('Tools')) {
      enhancedQuery += ' tool equipment';
    }
    if (tags.includes('Apple')) {
      enhancedQuery += ' Apple product';
    }
    if (tags.includes('Networking')) {
      enhancedQuery += ' network hardware';
    }
    if (tags.includes('Projector')) {
      enhancedQuery += ' projector device';
    }
    if (tags.includes('Bike')) {
      enhancedQuery += ' bicycle';
    }
    if (tags.includes('Water Bottle')) {
      enhancedQuery += ' water container';
    }
    
    // Add Iowa State context for better relevance
    enhancedQuery += ' Iowa State University';
    
    // Encode the enhanced search query
    const query = encodeURIComponent(enhancedQuery);
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    };

    const response = await axios.get(
      `https://www.bing.com/images/search?q=${query}&first=1`,
      { headers }
    );

    const $ = cheerio.load(response.data);
    
    const firstImage = $('.iusc').first();
    if (firstImage.length) {
      const m = firstImage.attr('m');
      if (m) {
        const imageData = JSON.parse(m);
        return imageData.murl;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching image for "${searchQuery}":`, error.message);
    return null;
  }
}

async function updateInventoryWithImages(inventoryData) {
  const updatedItems = [];
  let processedCount = 0;
  const totalItems = inventoryData.items.length;

  for (const item of inventoryData.items) {
    try {
      const imageUrl = await getFirstBingImageUrl(item.itemName, item.tags);
      
      updatedItems.push({
        ...item,
        imageUrl: imageUrl
      });
      
      processedCount++;
      console.log(`✓ [${processedCount}/${totalItems}] Added image for: ${item.itemName}`);
      console.log(`  Tags used: ${item.tags.join(', ')}`);
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`✗ [${processedCount}/${totalItems}] Failed to add image for: ${item.itemName}`);
      updatedItems.push(item);
      processedCount++;
    }
  }
  
  return {
    latestUpdate: inventoryData.latestUpdate,
    items: updatedItems
  };
}

async function main() {
  try {
    console.log('Reading inventory file...');
    const rawData = await fs.readFile('surplus-inventory.json', 'utf8');
    const inventory = JSON.parse(rawData);
    
    console.log(`Found ${inventory.items.length} items to process`);
    console.log('Starting image search...');
    
    const updatedInventory = await updateInventoryWithImages(inventory);
    
    // Create backup of original file
    const backupFilename = `inventory_backup_${Date.now()}.json`;
    await fs.writeFile(backupFilename, rawData, 'utf8');
    console.log(`Created backup: ${backupFilename}`);
    
    // Save updated inventory
    await fs.writeFile(
      'inventory.json',
      JSON.stringify(updatedInventory, null, 2),
      'utf8'
    );
    
    console.log('Successfully updated inventory with image URLs');
    
    // Print statistics
    const itemsWithImages = updatedInventory.items.filter(item => item.imageUrl).length;
    console.log('\nUpdate Summary:');
    console.log(`Total items: ${updatedInventory.items.length}`);
    console.log(`Items with images: ${itemsWithImages}`);
    console.log(`Success rate: ${((itemsWithImages/updatedInventory.items.length) * 100).toFixed(1)}%`);
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getFirstBingImageUrl,
  updateInventoryWithImages
};
