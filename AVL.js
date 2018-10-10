const fs = require('fs');

let Node = function() {
  this.value;
  this.left;
  this.right;
  this.height;
  this.balance;

  // update
  function setHeight(node) {
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
  
  function update(arr) {
    for (i = arr.length - 1; i >= 0; i--) {
      setHeight(arr[i]);
      setBalance(arr[i]);
    }
    balance(arr);
  }

  function setBalance(node) {
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

  //  balance
  function balance(arr) {
    for (i = arr.length - 1; i >= 0; i--) {

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
  // right left Rotation
  function rightLeftRotation(arr, i) {
    let node = arr[i];
    let root = Object.assign({}, node.right);

    if (root.left.right) {
      root.left =  root.left.right;
    } else {
      root.left = undefined;
    }
    node.right.left.right = root;
    node.right = node.right.left;
    rightRotation(arr, i);
  }
  //  left right rotation
  function leftRightRotation(arr, i) {
    let node = arr[i];
    let root = Object.assign({}, node.left);

    if (root.right.left) {
      root.right =  root.right.left;
    } else {
      root.right = undefined;
    }
    node.left.right.left = root;
    node.left = node.left.right;
    leftRotation(arr, i);
  }

  // right rotation
  function rightRotation(arr, i) {
    let node = arr[i];
    let root = Object.assign({}, node);

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
    let root = Object.assign({}, node);

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

  //  Insertion
  this.insert = function(value) {
    arr = [];
    node = this;
    while (node) {
      if (node.value == undefined) {
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

  this.search = function(value) {
    console.log('Looking for ' + value + ' in tree...' );
    node = this;
    let counter = 0;
    while (node) {
      if (node.value == value) {
        console.log('found \"' + value + '\" in ' + counter + ' steps.' );
        return { node:arr[0],
                 steps: counter};
      } else if (node.value > value) {
        node = node.left;
      } else if (node.value < value) {
        node=node.right;
      }
      counter ++;
    }
  }
  //  Deletion
  this.delete = function(value) {
    if (this.value == value) {

    } else if (this.value > value) {
      if (!this.left) {
        console.log(value + ' not found, could not remove it');
      } else {
        this.left.delete(value);
      }
    } else if (this.value < value) {
      if (!this.right) {
        console.log(value + ' not found, could not remove it');
      }
    }
  }
}




let tree = new Node();

for (j=0; j < 10000; j++) {
  let aux = Math.floor(Math.random() * 100000);
  tree = tree.insert(aux);
}
tree.search(tree.left.right.right.value);
let data = JSON.stringify(tree, null, 2);
fs.writeFileSync('avlTree.json', data);
