const fs = require('fs');

let Node = function() {
  this.value;
  this.left;
  this.right;
  this.height;
  this.balance;

  //  Insertion
  this.insert = function(value) {
    let arr = [];   // this array will contain the path from root to the node to be inserted
    node = this;

    while (node) {  // iterates over the tree while it's not empty
      if (node.value == undefined) {  // finding new node to assign value
        node.value = value;
        node.height = 0;
        arr.push(node);
        update(arr);
        return arr[0];
      } else if (node.value > value) {
        arr.push(node);
        if (!node.left) {
          node.left = new Node();
        }
        node = node.left;
      } else if (node.value < value) {
        arr.push(node);
        if (!node.right) {
          node.right = new Node();
        }
        node = node.right;
      } else if (value == node.value) {
        console.log('\"' + value + '\" already in tree');
        arr.push(node);
        return arr[0];
      }
    }

  }

  // update values and balance the tree
  function update(arr) {
    for (i = arr.length - 1; i >= 0; i--) { // sets height and balances for every element in the array obtained in the "insert" function
      setHeight(arr[i]);
      setBalance(arr[i]);
    }
    balance(arr);
  }

  function setHeight(node) {
    // sets the height of a node depending on its children situation
    if (!node.left && !node.right) {
      node.height = 0;
    } else if (!node.left) {
      node.height = node.right.height + 1;
    } else if (!node.right) {
      node.height = node.left.height + 1;
    } else {
      node.height = Math.max(node.right.height, node.left.height) + 1;
    }
  }

  // balance setting
  function setBalance(node) {
    // sets the balance of a node depending on its children situtation
    if (node.left && node.right) {
      node.balance = node.right.height - node.left.height;
    } else if (!node.left && !node.right) {
      node.balance = 0;
    }else if (!node.left) {
      node.balance = node.right.height + 1;
    } else if (!node.right) {
      node.balance = -(node.left.height + 1);
    }
  }

  //  Tree balancing
  function balance(arr) {
    for (i = arr.length - 1; i >= 0; i--) {
      // detects unbalanced nodes and the case they're in, and balances the tree
      if (arr[i].balance == 2 || arr[i].balance == -2) {
        let unbalanced = arr[i];
        if (unbalanced.balance == 2 && unbalanced.right.balance == 1) {
          console.log('right-right case');
          rightRotation(arr, i);
        } else if (unbalanced.balance == -2 && unbalanced.left.balance == -1) {
          console.log('left-left case');
          leftRotation(arr, i);
        } else if (unbalanced.balance == 2 && unbalanced.right.balance == -1) {
          console.log('right-left case');
          rightLeftRotation(arr, i);
        } else if (unbalanced.balance == -2 && unbalanced.left.balance == 1) {
          console.log('left-right case');
          leftRightRotation(arr, i);
        }
        break;
      }
    }
  }

  // Right rotation
  function rightRotation(arr, i) {
    let node = arr[i];
    let root = Object.assign({}, node); // assign a copy of node to root so it's not modified in memory

    // Nodes rotation
    if (node.right.left) {
      root.right = node.right.left;
    } else {
      root.right = undefined;
    }
    node.right.left = root;
    node = node.right;
    if (i != 0) {
      if (arr[i - 1].value > node.value) {
        arr[i - 1].left = node;
      } else {
        arr[i - 1].right = node;
      }
    } else {
      arr[0] = node;
    }

    // Updates heights and balances of all the nodes from the rotation to root
    setHeight(node.left);
    setHeight(node.right);
    setHeight(node);
    setBalance(node);
    setBalance(node.right);
    setBalance(node.left);
    for(k = i-1; k >= 0; k--) {
      setHeight(arr[k]);
      setBalance(arr[k]);
    }
  }

  // Left Rotation
  function leftRotation(arr, i) {
    let node = arr[i];
    let root = Object.assign({}, node); // assign a copy of node to root so it's not modified in memory

    // Nodes rotation
    if (node.left.right) {
      root.left = node.left.right;
    } else {
      root.left = undefined;
    }
    node.left.right = root;
    node = node.left;
    if (i != 0) {
      if (arr[i - 1].value > node.value) {
        arr[i - 1].left = node;
      } else {
        arr[i - 1].right = node;
      }
    } else {
      arr[i] = node;
    }
    // Updates heights and balances of all the nodes from the rotation to root
    setHeight(node.left);
    setHeight(node.right);
    setHeight(node);
    setBalance(node);
    setBalance(node.right);
    setBalance(node.left);
    for(k = i-1; k >= 0; k--) {
      setHeight(arr[k]);
      setBalance(arr[k]);
    }
  }

  // Right-Left Rotation
  function rightLeftRotation(arr, i) {
    let node = arr[i];
    let root = Object.assign({}, node.right);

    // first step of nodes rotation
    if (root.left.right) {
      root.left =  root.left.right;
    } else {
      root.left = undefined;
    }
    node.right.left.right = root;
    node.right = node.right.left;
    // second step of nodes rotation
    rightRotation(arr, i);
  }

  //  Left-Right rotation
  function leftRightRotation(arr, i) {
    let node = arr[i];
    let root = Object.assign({}, node.left);

    // first step of nodes rotation
    if (root.right.left) {
      root.right =  root.right.left;
    } else {
      root.right = undefined;
    }
    node.left.right.left = root;
    node.left = node.left.right;
    // second step of nodes rotation
    leftRotation(arr, i);
  }

  //  Searching
  this.search = function(value) {
    console.log('Looking for ' + value + ' in tree...' );
    node = this;
    let counter = 0;
    // looking for value in tree
    while (node) {
      if (node.value == value) {
        console.log('found \"' + value + '\" in ' + counter + ' steps.' );
        return { node,     // returns an object containing the node found and the "cost" measured in steps
                 steps: counter};
      } else if (node.value > value) {
        node = node.left;
      } else if (node.value < value) {
        node=node.right;
      }
      counter ++;
    }
  }

  this.preorder = function() {
    console.log('\nPrinting tree preorder()\n')
    let stack = [];
    stack.push(this);
    while (stack.length > 0) {
      let x = stack.pop();
      console.log(' " ' + x.value + ' " ');
      if (x.right)
        stack.push(x.right);
      if (x.left)
        stack.push(x.left);
    }
  }

  this.postorder = function() {
    console.log('\nPrinting tree postorder()\n');
    let stack = [];
    stack.push({node: this, state: 0});

    while (stack.length > 0) {
      let x = stack.pop();
      if (x.state == 0) {
        stack.push({node: x.node, state:1});
        if (x.node.right)
          stack.push({node: x.node.right, state: 0});
        if (x.node.left)
          stack.push({node: x.node.left, state: 0});
      } else {
        console.log(' " ' + x.node.value + ' "');
      }
    }
  }

  this.inorder = function() {
    console.log('\nPrinting tree inorder()\n');
    let stack = [];
    stack.push({node: this, state:0});
    while (stack.length > 0) {
      x = stack.pop();
      if (x.state == 0) {
        stack.push({node: x.node, state: 1});
        if (x.node.left)
          stack.push({node: x.node.left, state: 0});
      } else {
        console.log(' " ' + x.node.value + ' " ');
        if (x.node.right)
          stack.push({node: x.node.right, state: 0});
      }
    }

  }
}




let tree = new Node();

for (j=0; j < 10; j++) {
  let aux = Math.floor(Math.random() * 100000);
  tree = tree.insert(aux);
}
let data = JSON.stringify(tree, null, 2);
fs.writeFileSync('avlTree.json', data);

tree.preorder();
tree.inorder();
tree.postorder();
