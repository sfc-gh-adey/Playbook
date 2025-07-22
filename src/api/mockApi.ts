export const fullMockData = [
  { rank: 1, CONTENT: 'Dell Sony WH-1000XM5 Headphones', DOC_ID: 'doc_776_251ead9f', TITLE: 'Dell Sony WH-1000XM5 Headphones', CATEGORY: 'Electronics', PRICE: '$1609', RATING: '3.7/5.0 stars' },
  { rank: 2, CONTENT: 'Dell Samsung Galaxy Phone', DOC_ID: 'doc_1403_8a0bfb65', TITLE: 'Dell Samsung Galaxy Phone', CATEGORY: 'Electronics', PRICE: '$1388', RATING: '4.2/5.0 stars' },
  { rank: 3, CONTENT: 'Dell Sennheiser HD Headphones', DOC_ID: 'doc_1022_1ce5f16b', TITLE: 'Dell Sennheiser HD Headphones', CATEGORY: 'Electronics', PRICE: '$1155', RATING: '4.5/5.0 stars' },
  { rank: 4, CONTENT: 'Dell Samsung Galaxy Watch Watch', DOC_ID: 'doc_298_9a7a4f22', TITLE: 'Dell Samsung Galaxy Watch Watch', CATEGORY: 'Electronics', PRICE: '$1270', RATING: '4.4/5.0 stars' },
];

export const mockApiSearch = (params: any, serviceType: string): Promise<any[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let results = [...fullMockData];
      
      // Simulate different results for B
      if (serviceType === 'B') {
        results = results.reverse();
      }
      
      // Simulate query filtering (very basic)
      if (params.query) {
        results = results.filter(item => 
          item.CONTENT.toLowerCase().includes(params.query.toLowerCase())
        );
      }
      
      // Apply limit
      results = results.slice(0, params.limit);
      
      resolve(results);
    }, 500); // Simulate network delay
  });
}; 