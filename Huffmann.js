class HuffmanCoder{

display(node, modify, index = 1){
      //preOrder tree printing
      if(modify === true){
          node = ['',node];
          if(node[1].length === 1){
             node[1] = node[1][0];
          } 
        }
            
         if(typeof(node) === "string"){
             return String[index] + " == " + node[1];
         }

         let left = this.display(node[1][0], modify, index*2);
         let right = this.display(node[1][1], modify, index*2+1);
         let res = String[index*2] + " <= " + index + " => " + String[index*2+1]; 
         return res + '\n' + left + '\n' + right;
     }

     stringify(node){
         //encoding huffman tree
         if(typeof(node[1]) === "string"){
            return '\''+ node[1];                 
}

return '0' + this.stringify(node[1][0]) + '1' + this.stringify(node[1][1]);           
}

   destringify(data){
       //decoding huffman tree
       let node = [];
       if(data[this.ind] === '\''){            //leaf nodes
             this.ind++;
            node.push(data[this.ind]);
            this.ind++;
           return node;
       }

        this.ind++;                             //in btw nodes
        let left = this.destringify(data);
         node.push(left);
         this.ind++;
        let right = this.destringify(data);
               node.push(right);

     return node;
     }

     getMappings(node, path){
         if(typeof(node[1]) === "string"){       //leaf = char, other = object
             this.mappings[node[1]] = path;
             return;
         }
    
         this.getMappings(node[1][0], path+"0");
         this.getMappings(node[1][1], path+"1");
     }

     encode(data){
         //get heap
         this.heap = new BinaryHeap();  //maxHeap

         //store freq cnt 
         const mp = new Map();
         for(let i = 0; i < data.length; i++){
             if(data[i] in mp){
                 mp[data[i]] = mp[data[i]] + 1;
             } else{
                 mp[data[i]] = i;
             }
         }
        
         //insert elements to minHeap
         for(const key in mp){
             this.heap.insert([-mp[key], key]); // neg because we need minHeap
         }
        
         //creating Huffman tree
         while(this.heap.size() > 1){
             const node1 = this.heap.extractMax();
             const node2 = this.heap.extractMax();

             const node = [node1[0]+node2[0], [node1, node2]];      //(freq, object)
             this.heap.insert(node); 
         }

         //extracting huffman tree
         const huffman_encoder = this.heap.extractMax();

         //get char to binary string mapping
         this.mappings = {};
         this.getMappings(huffman_encoder, "");

         //mapping char string to binary string
         let binary_string = "";
         for(let i = 0; i < data.length; i++){
             binary_string = binary_string + this.mappings[data[i]];
         }

         //padding binary string to make length multiple of 8
         let rem = (8-binary_string.length%8) %8;
         let padding = "";
         for(let i = 0; i < rem; i++){
             padding = padding + "0";
         }

         binary_string = binary_string + padding;


// binary string to corresponding char array

        let result = "";

        for(let i = 0; i < binary_string.length; i+=8){

           let num = 0;

            for(let j = 0; j < 8; j++){

               num = num*2 + (binary_string[i+j] - "0");

               }

           result = result + String.fromCharCode(num);       // result = encoded data = (, $)
        }
    

//concatenate required info to decode tree

       let final_res = this.stringify(huffman_encoder) + '\n' + rem + '\n' + result;         // tree + padding + encoded data

       let info = "Comprssion ratio :" + data.length/ final_res.length;

       info = "Compression complete and file sent for download" + '\n' + info;
        

//Returning encoded data, tree structure, extra info

        return [final_res, this.display(huffman_encoder, false), info];

       }


    decode(data){
                //splitting string into tree, padding, encoded text

       data = data.split('\n');

        if(data.length === 4){                                     

           //handling new line in huffman tree

            data[0] = data[0] + '\n' + data[1];
            data[1] = data[2];

            data[2] = data[3];
           data.pop();

       }


       this.ind = 0;

       //decoding huffman tree

       const huffman_decoder = this.destringify(data[0]);
      const text = data[2];

        //encoded text-> binary string
       let binary_string = "";

       for(let i = 0; i < text.length; i++){

           let num = text[i].charCodeAt(0);

           let bin = "";

           for(let j = 0; j < 8; j++){

               bin = num%2 + bin;

               num = Math.floor(num/2);

           }

           binary_string = binary_string + bin;

       }

       //Remove padding
      binary_string = binary_string.substring(0, binary_string.length-data[1]);


//binary string -> original text (using huffman tree)

         let res = "";

         let node = huffman_decoder;
                  for (let i = 0; i < binary_string.length; i++) {

            if(binary_string[i] === '0'){

                node = node[0];

                } else{

                node = node[1];

                }
            
            if(typeof(node[0]) == "string"){

res += node[0];

                 node = huffman_decoder;

                }

            }


         let info = "Decompression complete and file sent for download";
    

         //Returning decoded text, tree structure, extra info

     return [res, this.display(huffman_decoder, true), info];

    }

    }
